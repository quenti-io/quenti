import slugify from "slugify";
import { z } from "zod";
import { DISALLOWED_ORG_SLUGS } from "../../common/constants";

export const ZUpdateSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  slug: z
    .string()
    .transform((slug) => slugify(slug.trim(), { lower: true, strict: true }))
    .refine((slug) => !DISALLOWED_ORG_SLUGS.includes(slug)),
  icon: z.number(),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
