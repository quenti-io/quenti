import React, { useMemo } from "react";

import { formatScripts } from "@quenti/lib/scripts";
import { LatexFormatter } from "./latex-formatter";

export const ScriptFormatter = ({ children }: { children: string }) => {
  const formatted = useMemo(() => formatScripts(children), [children]);

  // Check if the text contains LaTeX expressions
  const hasLatex = useMemo(() => {
    return /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/.test(children);
  }, [children]);

  // If LaTeX is detected, use LatexFormatter which will handle both LaTeX and regular text
  if (hasLatex) {
    return <LatexFormatter>{children}</LatexFormatter>;
  }

  // Otherwise, use the original script formatting
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
