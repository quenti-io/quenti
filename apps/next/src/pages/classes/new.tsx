import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { EnabledFeature } from "@quenti/lib/feature";
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
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { Loading } from "../../components/loading";
import { WizardLayout } from "../../components/wizard-layout";
import { useFeature } from "../../hooks/use-feature";
import { useStudentRedirect } from "../../hooks/use-student-redirect";
import { getLayout } from "../../layouts/main-layout";
import { useTelemetry } from "../../lib/telemetry";
import { ClassLogo } from "../../modules/classes/class-logo";
import { useClassLogoUpload } from "../../modules/classes/use-class-logo-upload";

interface CreateClassFormInputs {
  name: string;
  description: string;
}

const schema = z.object({
  name: z
    .string({ required_error: "Enter a name" })
    .trim()
    .nonempty({ message: "Enter a name" }),
  description: z.string().default("").optional(),
});

export default function NewClass() {
  const router = useRouter();
  const { event } = useTelemetry();
  const { data: session } = useSession();
  const earlyClassAccess = useFeature(EnabledFeature.EarlyClassAccess);

  useStudentRedirect("/home");

  const sendEvent = (id: string, name: string) => {
    void event("class_created", { id, name });
  };

  const { file, setFile, onInputFile, uploadLogo } = useClassLogoUpload({
    onComplete: async (classId) => {
      sendEvent(classId, create.variables?.name || "");
      await router.push(`/classes/${classId}/teachers-onboarding`);
    },
  });

  const create = api.classes.create.useMutation({
    onSuccess: async (data) => {
      if (!file) {
        sendEvent(data.id, data.name);
        await router.push(`/classes/${data.id}/teachers-onboarding`);
        return;
      }
      await uploadLogo.mutateAsync({ classId: data.id });
    },
  });

  const createMethods = useForm<CreateClassFormInputs>({
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors },
  } = createMethods;

  const onSubmit: SubmitHandler<CreateClassFormInputs> = async (data) => {
    await create.mutateAsync(data);
  };

  React.useEffect(() => {
    if (!session?.user || session.user.organizationId || earlyClassAccess)
      return;
    void router.push("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  if (!session?.user || (!session.user.organizationId && !earlyClassAccess))
    return <Loading />;

  return (
    <WizardLayout
      title="Create a new class"
      seoTitle="New Class"
      description="Create a class to manage students and create assignments."
      steps={4}
      currentStep={0}
    >
      <form onSubmit={createMethods.handleSubmit(onSubmit)}>
        <Card p="8" variant="outline" shadow="lg" rounded="xl">
          <Stack spacing="10">
            <Stack spacing="6">
              <Stack spacing="1">
                <HStack spacing="4">
                  <Box
                    rounded="xl"
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
                    <ClassLogo
                      url={file ? (file as string) : undefined}
                      width={64}
                      height={64}
                      local
                    />
                  </Box>
                  <Stack spacing="2">
                    <FormLabel m="0" fontWeight={700} fontSize="sm">
                      Class logo
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
                      Image files up to 10 MB (recommended 256px x 256px)
                    </Text>
                  </Stack>
                </HStack>
              </Stack>
              <Controller
                name="name"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize="sm" mb="10px">
                      Class name
                    </FormLabel>
                    <Input
                      placeholder="Biology 101"
                      autoFocus
                      defaultValue={value}
                      onChange={onChange}
                      px="14px"
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="description"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.description}>
                    <FormLabel fontSize="sm" mb="10px">
                      Description (optional)
                    </FormLabel>
                    <AutoResizeTextarea
                      placeholder="A class about biology."
                      defaultValue={value}
                      onChange={onChange}
                      allowTab={false}
                      px="14px"
                    />
                    <FormErrorMessage>
                      {errors.description?.message}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              <HStack spacing="4"></HStack>
            </Stack>
            <ButtonGroup w="full">
              <Button
                variant="outline"
                w="full"
                onClick={() => router.back()}
                colorScheme="gray"
                fontSize="sm"
              >
                Cancel
              </Button>
              <Button
                w="full"
                rightIcon={<IconArrowRight size="18" />}
                type="submit"
                fontSize="sm"
                isLoading={create.isLoading}
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

NewClass.PageWrapper = PageWrapper;
NewClass.getLayout = getLayout;
