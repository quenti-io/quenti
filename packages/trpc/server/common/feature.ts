export const hasFeature = (feature: number, flags: number) => {
  return (flags & feature) === feature;
};
