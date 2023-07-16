import { Button } from "@chakra-ui/react";
import { useOrganization } from "../../../hooks/use-organization";
import { SettingsWrapper } from "../settings-wrapper";
import { Link } from "../../../components/link";
import { BASE_URL } from "../../../constants/url";

export const OrganizationBilling = () => {
  const org = useOrganization();

  return (
    <SettingsWrapper
      heading="Billing"
      description="Manage organization billing and your subscription"
      isLoaded={!!org}
    >
      <Button as={Link} href={`${BASE_URL}/api/billing?orgId=${org?.id || ""}`}>
        Billing Portal
      </Button>
    </SettingsWrapper>
  );
};
