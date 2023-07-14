import slugify from "slugify";
import { z } from "zod";
import { DISALLOWED_ORG_SLUGS } from "../../common/constants";

export const ZCreateSchema = z.object({
  name: z.string(),
  slug: z
    .string()
    .transform((slug) => slugify(slug.trim(), { lower: true, strict: true }))
    .refine((slug) => !DISALLOWED_ORG_SLUGS.includes(slug)),
});

export type TCreateSchema = z.infer<typeof ZCreateSchema>;
