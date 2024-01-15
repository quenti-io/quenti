import { z } from "zod";

import { BANNER_COLORS } from "@quenti/lib/color";

export const ZUpdateSchema = z.object({
  id: z.string().cuid2(),
  name: z.string(),
  description: z.string(),
  bannerColor: z.string().refine((s) => BANNER_COLORS.includes(s)),
  clearLogo: z.boolean().optional(),
});

export type TUpdateSchema = z.infer<typeof ZUpdateSchema>;
