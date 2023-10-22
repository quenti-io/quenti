export const getRandom = <T>(arr: T[]) => {
  return arr[Math.floor(Math.random() * arr.length)]!;
};

export const shuffleArray = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j]!;
    arr[j] = temp!;
  }
  return arr;
};

export const chunkArray = <T>(_arr: T[], chunks: number) => {
  const arr = Array.from(_arr);
  const res = [];

  while (arr.length > 0) {
    const chunk = arr.splice(0, chunks);
    res.push(chunk);
  }
  return res;
};

export const takeNRandom = <T>(arr: T[], n: number) => {
  const shuffled = shuffleArray(Array.from(arr));
  return shuffled.slice(0, n);
};

export const allEqual = <T>(arr: T[]) => arr.every((val) => val === arr[0]);
