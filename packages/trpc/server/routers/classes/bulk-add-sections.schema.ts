import { z } from "zod";

export const ZBulkAddSectionsSchema = z.object({
  classId: z.string().cuid2(),
  sections: z.array(z.string().nonempty().trim()).max(10),
});

export type TBulkAddSectionsSchema = z.infer<typeof ZBulkAddSectionsSchema>;
