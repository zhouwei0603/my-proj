export function format(template: string, data: Record<string, unknown>): string {
  return template.replace(/{(.*?)}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? String(value) : `{${key}}`;
  });
}