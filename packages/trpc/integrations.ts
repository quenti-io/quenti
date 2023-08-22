export const importIntegration = async (path: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await import(`../integrations/${path}`);
};
