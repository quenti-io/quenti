import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { WizardLayout } from "../../../components/wizard-layout";
import {
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { IconArrowLeft } from "@tabler/icons-react";

export default function OrgDomainSetup() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: session } = useSession();

  const [domain, setDomain] = React.useState("");
  const [email, setEmail] = React.useState("");

  const { data: org } = api.organizations.get.useQuery(
    { id },
    {
      enabled: !!id && !!session?.user?.id,
      retry: false,
    }
  );

  const verifyDomain = api.organizations.verifyDomain.useMutation({
    onSuccess: async () => {
      await router.push(`/orgs/${org!.id}/verify-email`);
    },
  });

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
      description="Set up your organization's domain to start enrolling students. New and existing accounts with an associated email ending in your domain will be automatically enrolled as students."
      steps={5}
      currentStep={2}
    >
      <Card p="8" variant="outline" shadow="lg" rounded="lg">
        <Stack spacing="10">
          <Stack spacing="6">
            <FormControl>
              <FormLabel fontSize="sm" mb="10px">
                Domain
              </FormLabel>
              <Input
                placeholder="example.edu"
                autoFocus
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" mb="10px">
                Email for verification
              </FormLabel>
              <Input
                placeholder={
                  !domain.trim().length
                    ? `Email address for that domain`
                    : `Email address ending in @${domain.trim()}`
                }
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </FormControl>
          </Stack>
          <ButtonGroup w="full">
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
              isLoading={verifyDomain.isLoading}
              onClick={async () => {
                await verifyDomain.mutateAsync({
                  domain: domain.trim(),
                  email: email.trim(),
                  orgId: org!.id,
                });
              }}
            >
              Add domain
            </Button>
          </ButtonGroup>
        </Stack>
      </Card>
    </WizardLayout>
  );
}
