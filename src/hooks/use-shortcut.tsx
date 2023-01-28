import React from "react";

/// https://devtrium.com/posts/how-keyboard-shortcut
export const useShortcut = (
  keys: (string | number)[],
  callback: (e: KeyboardEvent) => void,
  ctrlKey = true,
  allowInput = false,
  anyKey = false,
  node = null
) => {
  // implement the callback ref pattern
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (
        (ctrlKey == event.ctrlKey && keys.some((key) => event.key === key)) ||
        anyKey
      ) {
        if (allowInput && event.target instanceof HTMLInputElement) return;

        event.preventDefault();
        callbackRef.current(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keys]
  );

  React.useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};
