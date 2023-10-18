import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";
import { APP_URL } from "@quenti/lib/constants/url";
import type { MembershipRole } from "@quenti/prisma/client";

import {
  Button,
  Card,
  Heading,
  Skeleton,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconExternalLink } from "@tabler/icons-react";

import { useOrganization } from "../../../hooks/use-organization";
import { useOrganizationMember } from "../../../hooks/use-organization-member";
import { SettingsWrapper } from "../settings-wrapper";

export const OrganizationBilling = () => {
  const router = useRouter();
  const { data: org } = useOrganization();
  const me = useOrganizationMember();

  const role: MembershipRole = me?.role ?? "Member";

  const isOwner = role == "Owner";
  const isAdmin = role == "Admin" || isOwner;

  React.useEffect(() => {
    if (org && !isAdmin) {
      void (async () => {
        await router.push(`/orgs/${org.id}`);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org, isAdmin]);

  const firstConflicting = org?.domains.find((d) => d.conflicting);

  const cardBg = useColorModeValue("white", "gray.800");
  const highlight = useColorModeValue("blue.500", "blue.200");
  const mutedText = useColorModeValue("gray.700", "gray.300");

  const defaultMessage = (
    <>
      In order to unlock the full suite of features and enroll students, you
      need to{" "}
      <Link
        href={`/api/orgs/${org?.id || ""}/purchase`}
        color="blue.300"
        transition="color 0.2s ease-in-out"
        _hover={{ color: highlight }}
        fontWeight={600}
      >
        purchase a plan
      </Link>
      .
    </>
  );

  const domainConflictMessage = (domain: string) => (
    <>
      In order to unlock the full suite of features and enroll students, you
      need to purchase a plan. It appears as though your domain{" "}
      <strong>{domain}</strong> has already been verified by another
      organization. Please reach out to us at{" "}
      <Link
        href={`mailto:${ORG_SUPPORT_EMAIL}`}
        color="blue.300"
        transition="color 0.2s ease-in-out"
        _hover={{ color: highlight }}
        fontWeight={700}
      >
        {ORG_SUPPORT_EMAIL}
      </Link>{" "}
      so that we can resolve this issue.
    </>
  );

  return (
    <Stack spacing="12">
      {!!org && !org.published && (
        <SlideFade in={!org.published} offsetY="-10px">
          <Card
            px="6"
            py="6"
            rounded="xl"
            borderLeftColor="orange.400"
            borderLeftWidth="2px"
            shadow="md"
            bg={cardBg}
          >
            <Stack>
              <Heading size="md">Thanks for trying out organizations!</Heading>
              <Text fontSize="sm" color={mutedText}>
                {firstConflicting
                  ? domainConflictMessage(firstConflicting.requestedDomain)
                  : defaultMessage}
              </Text>
            </Stack>
          </Card>
        </SlideFade>
      )}
      <SettingsWrapper
        heading="Billing"
        description="Manage organization billing and your subscription through Stripe"
        noOfLines={2}
        isLoaded={!!org}
      >
        <Skeleton rounded="md" fitContent h="max-content" isLoaded={!!org}>
          <Button
            as={Link}
            href={`${APP_URL}/api/billing?orgId=${org?.id || ""}`}
            leftIcon={<IconExternalLink size={18} />}
            w="max"
            variant="ghost"
          >
            Billing portal
          </Button>
        </Skeleton>
      </SettingsWrapper>
    </Stack>
  );
};
