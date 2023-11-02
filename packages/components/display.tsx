import type { JSONContent } from "@tiptap/react";
import React from "react";
import { filterXSS } from "xss";

import { ScriptFormatter } from "./script-formatter";
import { richTextToHtml } from "@quenti/lib/editor";
import type { Prisma } from "@quenti/prisma/client";

export const Display: React.FC<{
  text: string;
  richText?: Prisma.JsonValue | JSON | JSONContent;
}> = ({ text, richText }) => {
  return richText ? (
    <p
      dangerouslySetInnerHTML={{
        __html: filterXSS(richTextToHtml(richText as JSONContent, true)),
      }}
    />
  ) : (
    <ScriptFormatter>{text}</ScriptFormatter>
  );
};
