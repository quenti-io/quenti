export const strip = <T extends object>(input: T): T => {
  // Return all of the non-undefined properties of the input
  return Object.fromEntries(
    Object.entries(input).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, value]) => value !== undefined && value !== null,
    ),
  ) as T;
};
