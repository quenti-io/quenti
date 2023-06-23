export const MAX_TITLE = 255;
export const MAX_DESC = 2000;
export const MAX_CHARS_TAGS = 100;
export const MAX_NUM_TAGS = 12;
export const MAX_TERM = 1000;

export const MATCH_MIN_TIME = 150;

import json from "../../../../languages.json";
const languages = json.languages;

export type Language = keyof typeof languages;
export const LANGUAGE_VALUES: [string, ...string[]] = Object.keys(
  languages
) as [Language, ...Language[]];
