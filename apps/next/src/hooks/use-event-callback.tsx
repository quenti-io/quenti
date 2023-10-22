import React from "react";

export function useEventCallback<T, K>(
  handler?: (value: T, event: K) => void,
): (value?: T, event?: K) => void {
  const callbackRef = React.useRef(handler);

  React.useEffect(() => {
    callbackRef.current = handler;
  });

  return React.useCallback(
    (value?: T, event?: K) =>
      callbackRef.current && callbackRef.current(value as T, event as K),
    [],
  );
}
