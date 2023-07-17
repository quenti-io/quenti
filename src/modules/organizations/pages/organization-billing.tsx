import { Button, Skeleton } from "@chakra-ui/react";
import { IconExternalLink } from "@tabler/icons-react";
import { Link } from "../../../components/link";
import { BASE_URL } from "../../../constants/url";
import { useOrganization } from "../../../hooks/use-organization";
import { SettingsWrapper } from "../settings-wrapper";
import { useSession } from "next-auth/react";
import type { MembershipRole } from "@prisma/client";
import React from "react";
import { useRouter } from "next/router";

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

  return (
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
        >
          Billing portal
        </Button>
      </Skeleton>
    </SettingsWrapper>
  );
};
