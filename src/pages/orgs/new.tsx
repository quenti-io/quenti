import {
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { WizardLayout } from "../../components/wizard-layout";
import { api } from "../../utils/api";
import { ORGANIZATION_ICONS } from "../../utils/icons";

export default function NewOrganization() {
  const router = useRouter();

  const [orgName, setOrgName] = React.useState("");
  const [icon, setIcon] = React.useState(0);

  const create = api.organizations.create.useMutation({
    onError: (error) => {
      if (
        error.message == "slug_conflict" ||
        error.data?.code == "BAD_REQUEST"
      ) {
      }
    },
    onSuccess: async (data) => {
      await router.push(`/orgs/${data.id}/members-onboarding`);
    },
  });

  const iconColor = useColorModeValue("#171923", "white");

  return (
    <WizardLayout
      title="Create a new organization"
      description="Create an organization to manage teachers and students."
      steps={5}
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
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm" mb="10px">
                Icon
              </FormLabel>
              <Box ml="-4px" mt="-4px">
                {ORGANIZATION_ICONS.map((Icon, i) => (
                  <Box display="inline-block" p="1" key={i}>
                    <Skeleton rounded="md" isLoaded>
                      <IconButton
                        w="max"
                        variant={icon == i ? "solid" : "ghost"}
                        aria-label="Icon"
                        onClick={() => setIcon(i)}
                        icon={
                          <Icon
                            size={18}
                            style={{ transition: "all 300ms" }}
                            color={icon == i ? "white" : iconColor}
                          />
                        }
                      />
                    </Skeleton>
                  </Box>
                ))}
              </Box>
            </FormControl>
          </Stack>
          <ButtonGroup w="full" size="sm">
            <Button variant="outline" w="full" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              w="full"
              rightIcon={<IconArrowRight size="18" />}
              onClick={async () => {
                await create.mutateAsync({ name: orgName, icon });
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
