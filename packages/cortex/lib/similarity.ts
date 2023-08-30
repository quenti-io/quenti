export const similarity = (a: number[], b: number[]): number => {
  const dotProduct = a.reduce((acc, cur, i) => acc + cur * b[i]!, 0);
  const magnitudeA = Math.sqrt(a.reduce((acc, cur) => acc + cur ** 2, 0));
  const magnitudeB = Math.sqrt(b.reduce((acc, cur) => acc + cur ** 2, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};
