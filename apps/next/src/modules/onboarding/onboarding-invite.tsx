import { api } from "@quenti/trpc";

import { Stack } from "@chakra-ui/react";

import { useMe } from "../../hooks/use-me";
import { OrganizationCard } from "../organizations/organization-card";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper, useNextStep } from "./present-wrapper";

export const OnboardingInvite = () => {
  const utils = api.useContext();
  const { data: me } = useMe();
  const next = useNextStep();
  const invite =
    me?.orgInvites.find((i) => i.organization.published)?.organization ||
    me?.orgInvites[0]?.organization;

  const acceptInvite = api.organizations.acceptInvite.useMutation({
    onSuccess: async () => {
      await utils.organizations.getBelonging.invalidate();
      await utils.user.me.invalidate();
      next();
    },
  });

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Join organization"
        description="You've been invited to join the following organization:"
        action="Accept invite"
        nextDisabled={!invite}
        nextLoading={acceptInvite.isLoading}
        onNext={async () => {
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
              icon={invite.icon}
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
