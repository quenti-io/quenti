import React from "react";

/// https://www.robinwieruch.de/react-hook-detect-click-outside-component/
export const useOutsideClick = (callback: () => void) => {
  const ref = React.useRef<any>();

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref]);

  return ref;
};
