export function parseCsv(text: string) {
    return text
      .split(/\r?\n/)
      .map(line => line.split(","))
      .filter(([a, b]) => a && b)
      .map(([a, b]) => (a && b ? { term: a.trim(), definition: b.trim() } : null))
      .filter(item => item !== null);
  }
  