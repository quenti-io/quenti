import { Col, Grid } from "@tremor/react";

import { Container, Stack } from "@chakra-ui/react";

import { OrganizationActivity } from "../dashboard/activity";
import { OrganizationClasses } from "../dashboard/classes";
import { OrganizationUsers } from "../dashboard/users";
import { OrgDisplay } from "../org-display";

export const OrganizationDashboard = () => {
  return (
    <Container maxW="6xl" flex="1">
      <Stack spacing="6">
        <OrgDisplay />
        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="mt-6 gap-6">
          <Col numColSpan={2} className="h-[500]">
            <OrganizationActivity />
          </Col>
          <Col numColSpan={1} className="space-y-6">
            <OrganizationUsers />
            <OrganizationClasses />
          </Col>
        </Grid>
      </Stack>
    </Container>
  );
};
