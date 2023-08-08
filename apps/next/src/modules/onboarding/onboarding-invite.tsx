import { Stack } from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { OrganizationCard } from "../organizations/organization-card";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingInvite = () => {
  const { data } = api.organizations.getBelonging.useQuery(undefined, {
    retry: false,
  });

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Join organizations"
        description="You've been invited to join the following organizations:"
        nextDisabled={!data || !data.accepted}
      >
        <Stack w="lg" spacing="4" maxH="lg" overflowY="auto">
          {data ? (
            <OrganizationCard
              id={data.id}
              name={data.name}
              members={data._count.members}
              students={data._count.users}
              accepted={data.accepted}
              displayJoined
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
