export const importConsole = async (path: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (await import(`../console/${path}`)) as {
    usernameAvailable: (username: string) => boolean;
  };
};
