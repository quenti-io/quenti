import React from "react";

interface UseShortcutOptions {
  ctrlKey?: boolean;
  shiftKey?: boolean | string;
  altKey?: boolean;
  allowInput?: boolean;
  anyKey?: boolean;
  node?: null;
}

/// https://devtrium.com/posts/how-keyboard-shortcut
export const useShortcut = (
  keys: (string | number)[],
  callback: (e: KeyboardEvent) => void,
  opts: UseShortcutOptions = {
    ctrlKey: true,
    allowInput: false,
    anyKey: false,
    node: null,
  },
) => {
  // implement the callback ref pattern
  const callbackRef = React.useRef(callback);
  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = React.useCallback(
    (event: KeyboardEvent) => {
      if (opts.shiftKey !== undefined) {
        if (
          (opts.shiftKey === true && !event.shiftKey) ||
          (opts.shiftKey === false && event.shiftKey) ||
          (typeof opts.shiftKey === "string" &&
            keys.some((k) => k == opts.shiftKey) &&
            !event.shiftKey)
        ) {
          return;
        }
      }

      if (
        (opts.ctrlKey == event.ctrlKey &&
          keys.some((key) => event.key === key)) ||
        (opts.altKey == event.altKey &&
          keys.some((key) => event.key === key)) ||
        (opts.anyKey && !(event.ctrlKey || event.altKey || event.metaKey))
      ) {
        if (
          opts.allowInput &&
          (event.target instanceof HTMLInputElement ||
            event.target instanceof HTMLTextAreaElement)
        )
          return;

        event.preventDefault();
        callbackRef.current(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [keys],
  );

  React.useEffect(() => {
    // target is either the provided node or the document
    const targetNode = opts.node ?? document;
    // attach the event listener
    targetNode && targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode && targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, opts.node]);
};
