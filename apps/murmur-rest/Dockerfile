FROM python:3.11-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    libssl-dev \
    libbz2-dev \
    libmcpp-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV MURMUR_ICE_HOST=murmur
ENV MURMUR_ICE_PORT=6502

EXPOSE 5000

CMD ["python", "app.py"]
