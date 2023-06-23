export const MAX_TITLE = 255;
export const MAX_DESC = 2000;
export const MAX_CHARS_TAGS = 100;
export const MAX_NUM_TAGS = 12;
export const MAX_TERM = 1000;

export const LEARN_TERMS_IN_ROUND = 7;

export const MATCH_TERMS_IN_ROUND = 6;
export const MATCH_MIN_TIME = 150;
export const MATCH_SHUFFLE_TIME = 0.5;

import json from "../../../../languages.json";
const languages = json.languages;

export type Language = keyof typeof languages;
export const LANGUAGE_VALUES: [string, ...string[]] = Object.keys(
  languages
) as [Language, ...Language[]];
