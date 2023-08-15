interface Cache {
  handlers: {
    [key: string]: (args: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ctx: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: any;
    }) => unknown;
  };
  routerPath: string;
}

export async function loadHandler<T extends Cache>(
  cache: T,
  handler: keyof T["handlers"] & string,
) {
  const handlers = cache.handlers;

  if (!handlers[handler]) {
    handlers[handler] = await import(
      `../routers/${cache.routerPath}/${handler}.handler`
    ).then((m: T["handlers"]) => {
      if (!m.default || typeof m.default != "function") {
        throw new Error(
          `Unable to load handler ${handler}... either it doesn't exist or you're missing the default export`,
        );
      }
      return m.default;
    });
  }
  if (!handlers[handler] || typeof handlers[handler] !== "function") {
    throw new Error(`Unable to load handler ${handler}`);
  }
}
