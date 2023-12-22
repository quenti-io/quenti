export const BANNER_COLORS = [
  "#fc8181",
  "#ffa54c",
  "#ffd54b",
  "#68d391",
  "#4fd1c5",
  "#cbd5e0",
  "#90cdf4",
  "#b794f4",
  "#f687b3",
];

export const randomBannerColor = () => {
  const i = Math.floor(Math.random() * BANNER_COLORS.length);
  return BANNER_COLORS[i]!;
};
