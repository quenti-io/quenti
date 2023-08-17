export const truncate = (text: string, maxLength: number, ellipsis = "...") => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

export const truncateOnWord = (
  text: string,
  maxLength = 148,
  ellipsis = "...",
) => {
  if (text.length <= maxLength) return text;
  let truncated = text.substring(0, maxLength - ellipsis.length);

  truncated = truncated.substring(
    0,
    Math.min(truncated.length, truncated.lastIndexOf(" ")),
  );

  return truncated + ellipsis;
};
