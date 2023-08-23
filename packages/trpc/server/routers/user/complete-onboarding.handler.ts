import type { NonNullableUserContext } from "../../lib/types";

type CompleteOnboardingOptions = {
  ctx: NonNullableUserContext;
};

export const completeOnboardingHandler = async ({
  ctx,
}: CompleteOnboardingOptions) => {
  await ctx.prisma.user.update({
    where: {
      id: ctx.session.user.id,
    },
    data: {
      completedOnboarding: true,
    },
  });
};

export default completeOnboardingHandler;
