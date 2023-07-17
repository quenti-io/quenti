import { Button, Skeleton } from "@chakra-ui/react";
import { IconExternalLink } from "@tabler/icons-react";
import { Link } from "../../../components/link";
import { BASE_URL } from "../../../constants/url";
import { useOrganization } from "../../../hooks/use-organization";
import { SettingsWrapper } from "../settings-wrapper";

export const OrganizationBilling = () => {
  const org = useOrganization();

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
