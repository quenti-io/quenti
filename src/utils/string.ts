export const plural = (word: string, value: number): string =>
  `${word}${value === 1 ? "" : "s"}`;
