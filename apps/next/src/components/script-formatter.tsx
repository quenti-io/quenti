import React, { useMemo } from "react";

import { formatScripts } from "../utils/scripts";

export const ScriptFormatter = ({ children }: { children: string }) => {
  const formatted = useMemo(() => formatScripts(children), [children]);

  return (
    <>
      {formatted.map((item, index) => (
        <React.Fragment key={index}>
          {item.sub ? (
            <sub>{item.value}</sub>
          ) : item.super ? (
            <sup>{item.value}</sup>
          ) : (
            item.value
          )}
        </React.Fragment>
      ))}
    </>
  );
};
