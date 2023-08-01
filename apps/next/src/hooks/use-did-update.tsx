import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDidUpdate = (f: () => any, args: any[]) => {
  const didMountRef = React.useRef(false);
  React.useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    return f && f(); // eslint-disable-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, args);
};
