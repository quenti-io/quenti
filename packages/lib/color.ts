export const BANNER_COLORS = [
  "#cbd5e0",
  "#fc8181",
  "#ffa54c",
  "#ffd54b",
  "#68d391",
  "#4fd1c5",
  "#90cdf4",
  "#b794f4",
  "#f687b3",
];

export const randomBannerColor = () => {
  const i = Math.floor(Math.random() * BANNER_COLORS.length);
  return BANNER_COLORS[i]!;
};
