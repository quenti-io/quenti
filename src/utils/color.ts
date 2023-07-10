export const getColorFromId = (cuid: string): string => {
  const colors = ["#ffd54b", "#ffa54c", "#b794f4", "#4fd1c5"];
  const lastCharacter = cuid.slice(-1);
  const intValue = lastCharacter.charCodeAt(0);

  return colors[intValue % colors.length] || colors[0]!;
};
