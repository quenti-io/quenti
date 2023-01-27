export const shuffleArray = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

export const chunkArray = (_arr: any[], chunks: number) => {
  const arr = Array.from(_arr);
  const res = [];

  while (arr.length > 0) {
    const chunk = arr.splice(0, chunks);
    res.push(chunk);
  }
  return res;
};

export const takeNRandom = (arr: any[], n: number) => {
  const shuffled = shuffleArray(Array.from(arr));
  return shuffled.slice(0, n);
};
