export const plural = (value: number, word: string): string =>
  `${value} ${word}${value === 1 ? "" : "s"}`;
