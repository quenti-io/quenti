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
import type { MembershipRole } from "@prisma/client";
import { IconExternalLink } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Link } from "../../../components/link";
import { BASE_URL } from "../../../constants/url";
import { useOrganization } from "../../../hooks/use-organization";
import { SettingsWrapper } from "../settings-wrapper";

export const OrganizationBilling = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const org = useOrganization();

  const role: MembershipRole = org
    ? org.members.find((x) => x.userId == session?.user?.id)!.role
    : "Member";

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

  const cardBg = useColorModeValue("white", "gray.750");
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack spacing="12">
      {!!org && !org.published && (
        <SlideFade in={!org.published} offsetY="-10px">
          <Card
            px="6"
            py="6"
            rounded="md"
            borderLeftColor="orange.400"
            borderLeftWidth="3px"
            shadow="md"
            bg={cardBg}
          >
            <Stack>
              <Heading size="md">Thanks for trying out organizations!</Heading>
              <Text fontSize="sm">
                In order to unlock the full suite of features and enroll
                students, you need to{" "}
                <Link
                  href={`/api/orgs/${org.id}/purchase`}
                  color="blue.300"
                  transition="color 0.2s ease-in-out"
                  _hover={{ color: highlight }}
                  fontWeight={600}
                >
                  purchase a plan
                </Link>
                .
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
            href={`${BASE_URL}/api/billing?orgId=${org?.id || ""}`}
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
