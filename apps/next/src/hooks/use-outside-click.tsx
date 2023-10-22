import React from "react";

/// https://www.robinwieruch.de/react-hook-detect-click-outside-component/
export const useOutsideClick = (callback: () => void) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [ref, callback]);

  return ref;
};
