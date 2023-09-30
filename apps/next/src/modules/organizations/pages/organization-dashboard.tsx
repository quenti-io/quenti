import { Col, Grid } from "@tremor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { api } from "@quenti/trpc";

import { Container, Stack } from "@chakra-ui/react";

import { OrganizationActivity } from "../dashboard/activity";
import { OrganizationClasses } from "../dashboard/classes";
import { OrganizationUsers } from "../dashboard/users";
import { OrgDisplay } from "../org-display";
import { OrganizationWelcome } from "../organization-welcome";
import { OrganizationMembers } from "./organization-members";

export const OrganizationDashboard = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const isUpgraded = router.query.upgrade === "success";

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user,
    },
  );

  return (
    <Container maxW="6xl" flex="1" px="0">
      <Stack spacing="12">
        {org && isUpgraded && org.published && <OrganizationWelcome />}
        <Stack spacing="6">
          <OrgDisplay />
          <Grid
            numItems={1}
            numItemsSm={1}
            numItemsLg={3}
            className="mt-6 gap-6"
          >
            <Col numColSpanLg={2} className="h-[500]">
              <OrganizationActivity />
            </Col>
            <Col numColSpan={1} className="space-y-6">
              <OrganizationUsers />
              <OrganizationClasses />
            </Col>
          </Grid>
        </Stack>
        <OrganizationMembers />
      </Stack>
    </Container>
  );
};
