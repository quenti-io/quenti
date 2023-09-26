import { getOrganizationActivity } from "@quenti/enterprise/analytics";

import { TRPCError } from "@trpc/server";

import { isOrganizationMember } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TGetActivitySchema } from "./get-activity.schema";

type GetActivityOptions = {
  ctx: NonNullableUserContext;
  input: TGetActivitySchema;
};

export const getActivityHandler = async ({
  ctx,
  input,
}: GetActivityOptions) => {
  if (!(await isOrganizationMember(ctx.session.user.id, input.id)))
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return await getOrganizationActivity(input.id, input.period);
};

export default getActivityHandler;
