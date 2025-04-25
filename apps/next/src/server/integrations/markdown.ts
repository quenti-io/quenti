export function parseMarkdown(text: string) {
    return text
      .split(/\r?\n\r?\n/)
      .map(block => block.split(/\r?\n/))
      .filter(([a, b]) => a && b)
      .map(([a, b]) => ({
        term: (a ?? "").replace(/^[-*]\s*/, "").trim(),
        definition: (b ?? "").replace(/^[-*]\s*/, "").trim(),
      }));
  }
  