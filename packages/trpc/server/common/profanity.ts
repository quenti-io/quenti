import profaneWords from "@2toad/profanity/dist/data/profane-words";
import { List } from "@2toad/profanity/dist/models";
import { ProfanityOptions } from "@2toad/profanity/dist/profanity-options";
import { escapeRegExp } from "@2toad/profanity/dist/utils/misc";
import type { JSONContent } from "@tiptap/react";

import { getPlainText } from "@quenti/lib/editor";

import { TRPCError } from "@trpc/server";

import whitelist from "./static/profanity.json";

const { defaultWhitelist, usernameWhitelist } = whitelist;

class Profanity {
  options: ProfanityOptions;
  whitelist: List;
  private blacklist: List;
  private regex: RegExp | undefined;

  constructor(options?: ProfanityOptions) {
    this.options = options || new ProfanityOptions();
    this.whitelist = new List(() => this.buildRegex());
    this.blacklist = new List(() => this.buildRegex());
    this.blacklist.addWords(profaneWords);
  }

  exists(text: string): boolean {
    this.regex!.lastIndex = 0;
    return this.regex!.test(text);
  }

  /**
   * Modified version of the original censor implementation to ensure the same number of characters
   */
  censor(text: string): string {
    return text.replace(this.regex!, function ($2) {
      return "*".repeat($2.length);
    });
  }

  addWords(words: string[]): void {
    this.blacklist.addWords(words);
  }
  removeWords(words: string[]): void {
    this.blacklist.removeWords(words);
  }

  private buildRegex(): void {
    const escapedBlacklistWords = this.blacklist.words.map(escapeRegExp);
    const escapedWhitelistWords = this.whitelist.words.map(escapeRegExp);

    const blacklistPattern = `${
      this.options.wholeWord ? "\\b" : ""
    }(${escapedBlacklistWords.join("|")})${
      this.options.wholeWord ? "\\b" : ""
    }`;
    const whitelistPattern = this.whitelist.empty
      ? ""
      : `(?!${escapedWhitelistWords.join("|")})`;

    this.regex = new RegExp(whitelistPattern + blacklistPattern, "ig");
  }
}

const options = new ProfanityOptions();
const usernameOptions = new ProfanityOptions();
usernameOptions.wholeWord = false;

export const profanity = new Profanity(options);
profanity.removeWords(defaultWhitelist);

export const usernameProfanity = new Profanity(usernameOptions);
usernameProfanity.removeWords(
  // Since we're filtering based on part of the word, it's more important to remove 3-4 letter
  // words that could be part of normal words like "cumbersome"
  // Better to err on the side of allowing the name than to censor something normal and look ridiculous
  defaultWhitelist.concat(...usernameWhitelist),
);

export const censorRichText = (json: JSONContent): JSONContent => {
  const plainText = getPlainText(json);
  const censored = profanity.censor(plainText).split("\n");

  return internalCensor(censored, json);
};

const internalCensor = (censored: string[], json: JSONContent): JSONContent => {
  const censorParagraph = (json: JSONContent, index: number) => {
    if (json.type !== "paragraph")
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    // May contain empty paragraphs
    if (!json.content) return;

    const rawCensored = censored[index]!;

    let counter = 0;
    for (const node of json.content) {
      if (node.type === "text" && typeof node.text == "string") {
        const start = counter;
        const end = counter + node.text.length;
        counter = end;

        node.text = rawCensored.slice(start, end);
      }
    }
  };

  if (json.type !== "doc" || json.content?.length !== censored.length)
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

  json.content.map((node, i) => censorParagraph(node, i));
  return json;
};
