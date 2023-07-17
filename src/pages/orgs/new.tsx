import {
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import slugify from "slugify";
import { WizardLayout } from "../../components/wizard-layout";
import { getBaseDomain } from "../../lib/urls";
import { api } from "../../utils/api";

export default function NewOrganization() {
  const router = useRouter();
  const addonBg = useColorModeValue("gray.100", "gray.750");

  const [orgName, setOrgName] = React.useState("");
  const [orgSlug, setOrgSlug] = React.useState("");
  const [slugError, setSlugError] = React.useState(false);

  const create = api.organizations.create.useMutation({
    onError: (error) => {
      if (
        error.message == "slug_conflict" ||
        error.data?.code == "BAD_REQUEST"
      ) {
        setSlugError(true);
      }
    },
    onSuccess: async (data) => {
      await router.push(`/orgs/${data.id}/members-onboarding`);
    },
  });

  return (
    <WizardLayout
      title="Create a new organization"
      description="Create an organization to manage teachers and students."
      steps={2}
      currentStep={0}
    >
      <Card p="8" variant="outline" shadow="lg" rounded="lg">
        <Stack spacing="10">
          <Stack spacing="6">
            <FormControl>
              <FormLabel fontSize="sm" mb="10px">
                Organization Name
              </FormLabel>
              <Input
                placeholder="Acme, Inc."
                autoFocus
                value={orgName}
                onChange={(e) => {
                  setOrgName(e.target.value);
                  setOrgSlug(
                    slugify(e.target.value, { lower: true, strict: true })
                  );
                }}
              />
            </FormControl>
            <FormControl isInvalid={slugError}>
              <FormLabel fontSize="sm" mb="10px">
                Organization URL
              </FormLabel>
              <InputGroup>
                <InputLeftAddon bg={addonBg}>
                  {getBaseDomain()}/orgs/
                </InputLeftAddon>
                <Input
                  placeholder="acme-inc"
                  value={orgSlug}
                  onChange={(e) => setOrgSlug(e.target.value)}
                />
              </InputGroup>
              {slugError && (
                <FormErrorMessage mt="3">
                  That URL is already taken.
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
          <ButtonGroup w="full">
            <Button variant="outline" w="full" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              w="full"
              rightIcon={<IconArrowRight size="18" />}
              onClick={async () => {
                setSlugError(false);
                await create.mutateAsync({ name: orgName, slug: orgSlug });
              }}
              isLoading={create.isLoading}
            >
              Continue
            </Button>
          </ButtonGroup>
        </Stack>
      </Card>
    </WizardLayout>
  );
}
