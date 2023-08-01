import { Stack } from "@chakra-ui/react";
import { api } from "../../utils/api";
import { OrganizationCard } from "../organizations/organization-card";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingInvites = () => {
  const { data: me } = api.user.me.useQuery(undefined, {
    retry: false,
  });

  const memberships = me?.memberships.sort(
    (a, b) => (a.accepted ? 1 : 0) - (b.accepted ? 1 : 0) || a.organization.name.localeCompare(b.organization.name)
  );
  const visible = memberships?.slice(0, 2);
  const visiblePending = visible?.filter((m) => !m.accepted);

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Join organizations"
        description="You've been invited to join the following organizations:"
        nextDisabled={!!visiblePending?.length}
      >
        <Stack w="lg" spacing="4" maxH="lg" overflowY="auto">
          {visible !== undefined ? (
            visible.map((m) => (
              <OrganizationCard
                key={m.organization.id}
                id={m.organization.id}
                name={m.organization.name}
                members={m.organization._count.members}
                students={m.organization._count.users}
                accepted={m.accepted}
                displayJoined
              />
            ))
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
