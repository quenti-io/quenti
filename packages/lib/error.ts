export const getErrorFromUnknown = (
  cause: unknown,
): Error & { statusCode?: number; code?: string } => {
  if (cause instanceof Error) return cause;
  if (typeof cause === "string") return new Error(cause, { cause });
  return new Error(`Error of type '${typeof cause}'`);
};
