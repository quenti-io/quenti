import { Button, ButtonGroup, Card } from "@chakra-ui/react";
import { IconArrowLeft } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { WizardLayout } from "../../../components/wizard-layout";
import { DomainForm } from "../../../modules/organizations/domain-form";
import { OrganizationContext } from "../../../modules/organizations/organization-layout";
import { api } from "@quenti/trpc";

export default function OrgDomainSetup() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();
  const utils = api.useContext();

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user?.id,
      retry: false,
    }
  );

  const me = org
    ? org.members.find((m) => m.user.id === session!.user!.id)
    : null;

  const [loading, setLoading] = React.useState(false);
  const [shouldTransition, setShouldTransition] = React.useState(false);

  React.useEffect(() => {
    if (org?.domain) {
      void (async () => {
        if (org.domain?.verifiedAt) {
          await router.push(`/orgs/${org.id}/publish`);
        } else {
          await router.push(`/orgs/${org.id}/verify-email`);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [org]);

  return (
    <WizardLayout
      title="Set up domain"
      description="Set up your organization's domain to start enrolling students. New and existing accounts with an associated email ending in your domain will be automatically enrolled once your organization is published."
      steps={5}
      currentStep={2}
    >
      <Card p="8" variant="outline" shadow="lg" rounded="lg">
        <OrganizationContext.Provider value={org && me ? { ...org, me } : null}>
          <DomainForm
            onChangeLoading={setLoading}
            onSuccess={async () => {
              setShouldTransition(true);
              await utils.organizations.get.invalidate();
            }}
          >
            <ButtonGroup w="full" size="sm">
              <Button
                w="full"
                variant="outline"
                leftIcon={<IconArrowLeft size={18} />}
                onClick={async () => {
                  await router.push(`/orgs/${id}/members-onboarding`);
                }}
              >
                Go back
              </Button>
              <Button
                w="full"
                type="submit"
                isLoading={loading || shouldTransition}
              >
                Add domain
              </Button>
            </ButtonGroup>
          </DomainForm>
        </OrganizationContext.Provider>
      </Card>
    </WizardLayout>
  );
}
