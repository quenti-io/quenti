import type z from "zod";

export const refineRegex: [
  (r: string) => void,
  (r: string) => Partial<z.util.Omit<z.ZodCustomIssue, "code">>,
] = [
  (r) => {
    try {
      new RegExp(r);
      return true;
    } catch (e) {
      return false;
    }
  },
  (r) => ({ message: `'${r}' is not a valid regular expression` }),
];
