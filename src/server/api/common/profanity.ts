import { Profanity, ProfanityOptions } from "@2toad/profanity";

const options = new ProfanityOptions();
options.grawlix = "****";

export const profanity = new Profanity(options);
profanity.removeWords([
  "nazi", // Useful in historical contexts
  "crap", // Bruh
  "butt", // _
  "butts", // _
  "ass", // I'll allow all 'ass' variations
  "asses",
  "a_s_s",
  "4r5e",
  "a$$",
  "as$",
  "a$s",
  "a55",
  "balls", // Too many instances where this could be used normally
  "homo", // Important prefix
  "damn", // Come one
  "f4nny", // Fine
  "fanny", // _
  "sex", // Biology
  "breasts", // Eh
  "muff", // Too much of a stretch from mf
  "nob", // It's 3 letters
  "pawn", // Literally chess terminology
  "poop", // Bruh
]);
