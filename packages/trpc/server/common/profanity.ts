import { Profanity, ProfanityOptions } from "@2toad/profanity";

const options = new ProfanityOptions();
options.grawlix = "****";

const usernameOptions = new ProfanityOptions();
usernameOptions.wholeWord = false;

const DEFAULT_WHITELIST = [
  "nazi", // Useful in historical contexts
  "crap", // Bruh
  "butt", // _
  "butts", // _
  "turd", // _
  "wang", // Last name
  "tosser", // English word
  "pron", // Misspelling that can be part of other words like "apron"
  "lust", // e.g. "luster"
  "lusting",
  "bloody", // Not profane enough, medical term
  "ass", // I'll allow all 'ass' variations
  "asses",
  "a_s_s",
  "a$$",
  "as$",
  "a$s",
  "a55",
  "4r5e",
  "arse",
  "arrse",
  "arses",
  "anus",
  "balls", // Too many instances where this could be used normally
  "homo", // Important prefix
  "damn", // Come one
  "f4nny", // Fine
  "fanny", // _
  "sex", // Biology
  "breasts", // Eh
  "prick", // Allowable
  "pricks", // _
  "muff", // Too much of a stretch from mf
  "nob", // It's 3 letters
  "pawn", // Literally chess terminology
  "poop", // Bruh
];

export const profanity = new Profanity(options);
profanity.removeWords(DEFAULT_WHITELIST);

export const usernameProfanity = new Profanity(usernameOptions);
usernameProfanity.removeWords(
  // Since we're filtering based on part of the word, it's more important to remove 3-4 letter
  // words that could be part of normal words like "cumbersome"
  // Better to err on the side of allowing the name than to censor something normal and look ridiculous
  DEFAULT_WHITELIST.concat([
    "tit",
    "tits",
    "titt",
    "cum",
    "cums",
    "dick", // 'Dickens' as a last name
    "cock",
    "cox",
    "spac", // e.g. space, spacious, etc.
  ]),
);
