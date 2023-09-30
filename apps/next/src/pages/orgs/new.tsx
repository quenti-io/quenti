import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconArrowRight, IconUpload } from "@tabler/icons-react";

import { PageWrapper } from "../../common/page-wrapper";
import { WizardLayout } from "../../components/wizard-layout";
import { getLayout } from "../../layouts/main-layout";
import { useTelemetry } from "../../lib/telemetry";
import { OrganizationLogo } from "../../modules/organizations/organization-logo";
import { useOrgLogoUpload } from "../../modules/organizations/use-org-logo-upload";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Enter a name" })
    .max(50, { message: "Name must be less than 50 characters" }),
});

interface NewOrganizationFormInput {
  name: string;
}

export default function NewOrganization() {
  const utils = api.useContext();
  const router = useRouter();
  const { event } = useTelemetry();

  const sendEvent = (id: string, name: string) => {
    void event("class_created", { id, name });
  };

  const { file, setFile, onInputFile, uploadLogo } = useOrgLogoUpload({
    onComplete: async (orgId) => {
      sendEvent(orgId, create.variables?.name || "");
      await router.push(`/orgs/${orgId}/members-onboarding`);
    },
  });

  const create = api.organizations.create.useMutation({
    onSuccess: async (data) => {
      await utils.user.me.invalidate();

      if (!file) {
        sendEvent(data.id, data.name);
        await router.push(`/orgs/${data.id}/members-onboarding`);
        return;
      }
      await uploadLogo.mutateAsync({ orgId: data.id });
    },
    onError: (error) => {
      if (error.message == "name_profane") {
        newOrganizationFormMethods.setError("name", {
          type: "custom",
          message: "Profane organization names are not allowed",
        });
      }
    },
  });

  const newOrganizationFormMethods = useForm<NewOrganizationFormInput>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    formState: { errors },
  } = newOrganizationFormMethods;

  const onSubmit: SubmitHandler<NewOrganizationFormInput> = async (data) => {
    await create.mutateAsync(data);
  };

  return (
    <WizardLayout
      title="Create a new organization"
      seoTitle="New Organization"
      description="Create an organization to manage teachers and students."
      steps={5}
      currentStep={0}
    >
      <form onSubmit={newOrganizationFormMethods.handleSubmit(onSubmit)}>
        <Card p="8" variant="outline" shadow="lg" rounded="xl">
          <Stack spacing="10">
            <Stack spacing="6">
              <HStack spacing="4">
                <Box
                  rounded="full"
                  minW="64px"
                  minH="64px"
                  bg="white"
                  border="solid 1px"
                  borderColor={file ? "white" : "gray.200"}
                  _dark={{
                    borderColor: file ? "gray.800" : "white",
                  }}
                  overflow="hidden"
                >
                  <OrganizationLogo
                    url={file ? (file as string) : undefined}
                    width={64}
                    height={64}
                    local
                  />
                </Box>
                <Stack spacing="2">
                  <FormLabel m="0" fontWeight={700} fontSize="sm">
                    Organization logo
                  </FormLabel>
                  <input
                    onInput={onInputFile}
                    style={{ display: "none" }}
                    type="file"
                    id="upload-logo-input"
                    accept="image/*"
                  />
                  <ButtonGroup
                    variant="outline"
                    colorScheme="gray"
                    size="sm"
                    fontSize="sm"
                  >
                    <label htmlFor="upload-logo-input">
                      <Button
                        as="span"
                        leftIcon={<IconUpload size={18} />}
                        cursor="pointer"
                      >
                        Upload image
                      </Button>
                    </label>
                    <Button isDisabled={!file} onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  </ButtonGroup>
                  <Text color="gray.500" fontSize="xs">
                    Image files up to 10 MB (recommended 512px x 512px)
                  </Text>
                </Stack>
              </HStack>
              <Controller
                name="name"
                control={newOrganizationFormMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" mb="10px">
                      Organization name
                    </FormLabel>
                    <Input
                      placeholder="Acme, Inc."
                      autoFocus
                      defaultValue={value}
                      onChange={onChange}
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
            </Stack>
            <ButtonGroup w="full">
              <Button
                variant="outline"
                w="full"
                onClick={() => router.back()}
                fontSize="sm"
              >
                Cancel
              </Button>
              <Button
                w="full"
                rightIcon={<IconArrowRight size="18" />}
                type="submit"
                isLoading={create.isLoading}
                fontSize="sm"
              >
                Continue
              </Button>
            </ButtonGroup>
          </Stack>
        </Card>
      </form>
    </WizardLayout>
  );
}

NewOrganization.PageWrapper = PageWrapper;
NewOrganization.getLayout = getLayout;
