import { bulkGradeAnswers } from "@quenti/cortex/grader";

import { getIp } from "../../lib/get-ip";
import { RateLimitType, rateLimitOrThrowMultiple } from "../../lib/rate-limit";
import type { NonNullableUserContext } from "../../lib/types";
import type { TBulkGradeSchema } from "./bulk-grade.schema";

type BulkGradeOptions = {
  ctx: NonNullableUserContext;
  input: TBulkGradeSchema;
};

export const bulkGradeHandler = async ({ ctx, input }: BulkGradeOptions) => {
  await rateLimitOrThrowMultiple({
    type: RateLimitType.Core,
    identifiers: [
      `cortex:bulk-grade-user-id-${ctx.session.user.id}`,
      `cortex:bulk-grade-ip-${getIp(ctx.req)}`,
    ],
  });

  return (await bulkGradeAnswers(input.answers)).map((evaluation, i) => ({
    ...evaluation,
    originalIndex: input.answers[i]?.index || 0,
  }));
};

export default bulkGradeHandler;
