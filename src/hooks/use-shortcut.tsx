import React from "react";

/// https://devtrium.com/posts/how-keyboard-shortcut
export const useShortcut = (
  keys: any[],
  callback: any,
  ctrlKey: boolean = true,
  shiftKey: boolean | string | undefined = undefined,
  allowInput: boolean = false,
  anyKey: boolean = false,
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
      // check if one of the key is part of the ones we want
      if (shiftKey !== undefined) {
        if (
          (shiftKey === true && !event.shiftKey) ||
          (shiftKey === false && event.shiftKey) ||
          (typeof shiftKey === "string" &&
            keys.some((k) => k.key == shiftKey) &&
            !event.shiftKey)
        ) {
          return;
        }
      }

      if (
        (ctrlKey == event.ctrlKey && keys.some((key) => event.key === key)) ||
        anyKey
      ) {
        if (allowInput && event.target instanceof HTMLInputElement) return;

        event.preventDefault();
        callbackRef.current(event);
      }
    },
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
