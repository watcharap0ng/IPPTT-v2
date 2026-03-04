/**
 * Simple template engine for device provisioning configs.
 * Replaces {{variable}} placeholders with values.
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] ?? match
  })
}

/**
 * Extract all variable names from a template.
 */
export function extractVariables(template: string): string[] {
  const matches = template.matchAll(/\{\{(\w+)\}\}/g)
  const vars = new Set<string>()
  for (const match of matches) {
    vars.add(match[1])
  }
  return Array.from(vars)
}
