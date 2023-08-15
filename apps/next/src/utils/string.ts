export const plural = (
  value: number,
  word: string,
  opts?: Partial<{ toLocaleString: boolean }>,
): string =>
  `${opts?.toLocaleString ? value.toLocaleString() : value} ${word}${
    value === 1 ? "" : "s"
  }`;
