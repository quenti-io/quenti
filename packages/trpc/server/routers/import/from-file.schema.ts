// packages/trpc/server/routers/import/from-file.schema.ts
import { z } from "zod";

/**
 * Schema para a rota `import.fromFile`
 */
export const ZFromFileSchema = z.object({
  fileName: z.string(),
  fileContent: z.string(),
});

/**
 * Tipo de input inferido
 */
export type FromFileInput = z.infer<typeof ZFromFileSchema>;
