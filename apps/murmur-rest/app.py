"""Murmur REST API wrapper using ZeroC ICE."""
import os
import sys
import Ice
from flask import Flask, jsonify, request
from functools import wraps

app = Flask(__name__)

MURMUR_ICE_HOST = os.getenv('MURMUR_ICE_HOST', 'murmur')
MURMUR_ICE_PORT = os.getenv('MURMUR_ICE_PORT', '6502')
ICE_SECRET = os.getenv('ICE_SECRET', '')

# ICE connection
ice_communicator = None
meta = None


def get_ice_connection():
    """Initialize or return existing ICE connection to Murmur."""
    global ice_communicator, meta

    if meta is not None:
        return meta

    props = Ice.createProperties()
    props.setProperty('Ice.ImplicitContext', 'Shared')
    props.setProperty('Ice.MessageSizeMax', '65536')

    init_data = Ice.InitializationData()
    init_data.properties = props

    ice_communicator = Ice.initialize(init_data)

    if ICE_SECRET:
        ice_communicator.getImplicitContext().put('secret', ICE_SECRET)

    proxy_str = f'Meta:tcp -h {MURMUR_ICE_HOST} -p {MURMUR_ICE_PORT}'
    proxy = ice_communicator.stringToProxy(proxy_str)

    # Load Murmur.ice slice definitions
    try:
        Ice.loadSlice('', ['-I' + Ice.getSliceDir(), 'Murmur.ice'])
        import Murmur
        meta = Murmur.MetaPrx.checkedCast(proxy)
    except Exception as e:
        app.logger.warning(f'ICE connection failed: {e}. Running in stub mode.')
        meta = None

    return meta


def ice_required(f):
    """Decorator that ensures ICE connection is available."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        connection = get_ice_connection()
        if connection is None:
            # Stub mode — return empty data
            return f(*args, ice_meta=None, **kwargs)
        return f(*args, ice_meta=connection, **kwargs)
    return wrapper


@app.route('/health')
def health():
    connected = meta is not None
    return jsonify({'status': 'ok', 'ice_connected': connected})


@app.route('/api/servers')
@ice_required
def get_servers(ice_meta=None):
    if ice_meta is None:
        return jsonify({'servers': [], 'stub': True})

    servers = ice_meta.getAllServers()
    result = []
    for server in servers:
        conf = server.getAllConf()
        result.append({
            'id': server.id(),
            'name': conf.get('registername', f'Server {server.id()}'),
            'running': server.isRunning(),
            'users_online': len(server.getUsers()) if server.isRunning() else 0,
            'max_users': int(conf.get('users', '100')),
            'port': int(conf.get('port', '64738')),
        })

    return jsonify({'servers': result})


@app.route('/api/servers/<int:server_id>/channels')
@ice_required
def get_channels(server_id, ice_meta=None):
    if ice_meta is None:
        return jsonify({'channels': [], 'stub': True})

    server = ice_meta.getServer(server_id)
    if not server or not server.isRunning():
        return jsonify({'error': 'Server not found or not running'}), 404

    channels = server.getChannels()
    result = []
    for cid, channel in channels.items():
        result.append({
            'id': channel.id,
            'name': channel.name,
            'parent': channel.parent,
            'description': channel.description,
            'temporary': channel.temporary,
            'position': channel.position,
        })

    return jsonify({'channels': sorted(result, key=lambda c: c['position'])})


@app.route('/api/servers/<int:server_id>/users')
@ice_required
def get_users(server_id, ice_meta=None):
    if ice_meta is None:
        return jsonify({'users': [], 'stub': True})

    server = ice_meta.getServer(server_id)
    if not server or not server.isRunning():
        return jsonify({'error': 'Server not found or not running'}), 404

    users = server.getUsers()
    result = []
    for session, user in users.items():
        result.append({
            'session': user.session,
            'name': user.name,
            'channel': user.channel,
            'mute': user.mute,
            'deaf': user.deaf,
            'selfMute': user.selfMute,
            'selfDeaf': user.selfDeaf,
            'online_secs': user.onlinesecs,
            'idle_secs': user.idlesecs,
        })

    return jsonify({'users': result})


@app.route('/api/servers/<int:server_id>/tree')
@ice_required
def get_tree(server_id, ice_meta=None):
    """Get combined channel tree with users nested inside."""
    if ice_meta is None:
        return jsonify({'tree': [], 'stub': True})

    server = ice_meta.getServer(server_id)
    if not server or not server.isRunning():
        return jsonify({'error': 'Server not found or not running'}), 404

    channels = server.getChannels()
    users = server.getUsers()

    # Build channel map
    channel_map = {}
    for cid, ch in channels.items():
        channel_map[ch.id] = {
            'id': ch.id,
            'name': ch.name,
            'parent': ch.parent,
            'children': [],
            'users': [],
        }

    # Assign users to channels
    for session, user in users.items():
        if user.channel in channel_map:
            channel_map[user.channel]['users'].append({
                'session': user.session,
                'name': user.name,
                'mute': user.mute or user.selfMute,
                'deaf': user.deaf or user.selfDeaf,
            })

    # Build tree from root (channel 0)
    for cid, ch in channel_map.items():
        if ch['parent'] in channel_map and ch['parent'] != cid:
            channel_map[ch['parent']]['children'].append(ch)

    root = channel_map.get(0, {'name': 'Root', 'children': [], 'users': []})
    return jsonify({'tree': root})


if __name__ == '__main__':
    port = int(os.getenv('PORT', '5000'))
    app.run(host='0.0.0.0', port=port, debug=True)
