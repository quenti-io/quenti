import { useSession } from "next-auth/react";

import { api } from "@quenti/trpc";

import { Stack } from "@chakra-ui/react";

import { useMe } from "../../hooks/use-me";
import { OrganizationCard } from "../organizations/organization-card";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingInvite = () => {
  const utils = api.useUtils();
  const { data: me } = useMe();
  const { data: session } = useSession();

  const next = useNextStep();
  const invite =
    me?.orgInvites.find((i) => i.organization.published)?.organization ||
    me?.orgInvites[0]?.organization;

  const setUserType = api.user.setUserType.useMutation();
  const acceptInvite = api.organizations.acceptInvite.useMutation({
    onSuccess: async () => {
      await utils.user.me.invalidate();
      next();
    },
  });

  const ensureIsTeacher = async () => {
    if (session?.user?.type == "Student") {
      await setUserType.mutateAsync({ type: "Teacher" });
    }
  };

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Join organization"
        seoTitle="Join Organization"
        description="You've been invited to join the following organization:"
        action="Accept invite"
        nextDisabled={!invite}
        nextLoading={setUserType.isLoading || acceptInvite.isLoading}
        onNext={async () => {
          await ensureIsTeacher();
          await acceptInvite.mutateAsync({
            accept: true,
            orgId: invite!.id,
          });
        }}
      >
        <Stack w="lg" spacing="4" maxH="lg" overflowY="auto">
          {invite ? (
            <OrganizationCard
              id={invite.id}
              logoUrl={invite.logoUrl}
              logoHash={invite.logoHash}
              name={invite.name}
              members={invite._count.members}
              students={invite._count.users}
              disableLink
            />
          ) : (
            <OrganizationCard
              id=""
              name="loading"
              skeleton
              members={0}
              students={0}
            />
          )}
        </Stack>
      </DefaultLayout>
    </PresentWrapper>
  );
};
