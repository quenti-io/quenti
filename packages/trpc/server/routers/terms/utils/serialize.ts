import { Prisma } from "@prisma/client";

import { getPlainText, getRichTextJson } from "@quenti/lib/editor";

import { MAX_TERM } from "../../../common/constants";
import { censorRichText, profanity } from "../../../common/profanity";

export const serialize = (
  plainText: string,
  richTextHtml?: string,
  sanitize = true,
  raw = false,
) => {
  let text = plainText;
  let richText = null;

  if (richTextHtml) {
    const json = getRichTextJson(richTextHtml);
    text = getPlainText(json);
    richText = json;
  }

  if (sanitize) {
    text = profanity.censor(text.slice(0, MAX_TERM));
    richText = richText
      ? (censorRichText(richText) as object)
      : raw
        ? null
        : Prisma.JsonNull;
  }

  return { plainText: text, richText: richText as object };
};
