export const BANNER_COLORS = ["#ffd54b", "#ffa54c", "#b794f4", "#4fd1c5"];

export const randomBannerColor = () => {
  const i = Math.floor(Math.random() * BANNER_COLORS.length);
  return BANNER_COLORS[i]!;
};
