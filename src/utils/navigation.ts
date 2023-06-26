export const isReloaded = () => {
  const navigationType = (
    window.performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming
  ).type;

  return navigationType === "reload";
};
