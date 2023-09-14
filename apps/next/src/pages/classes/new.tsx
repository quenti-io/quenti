import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { env } from "@quenti/env/client";
import { dataUrlToBuffer } from "@quenti/images/react/utils";
import { useFileReader } from "@quenti/lib/hooks";
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
import { WizardLayout } from "../../components/wizard-layout";
import { useStudentRedirect } from "../../hooks/use-student-redirect";
import { getLayout } from "../../layouts/main-layout";
import { ClassLogo } from "../../modules/classes/class-logo";

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

interface FileEvent<T = Element> extends React.FormEvent<T> {
  target: EventTarget & T;
}

export default function NewClass() {
  const router = useRouter();
  useStudentRedirect("/home");

  const [{ result }, setFile] = useFileReader({
    method: "readAsDataURL",
  });

  const uploadComplete = api.classes.uploadLogoComplete.useMutation({
    onSuccess: async (_, { classId }) => {
      await router.push(`/classes/${classId}/teachers-onboarding`);
    },
  });

  const uploadLogo = api.classes.uploadLogo.useMutation({
    onSuccess: async (jwt, { classId }) => {
      if (!result || !env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT) return;
      const buffer = dataUrlToBuffer(result as string);

      const response = await fetch(
        `${env.NEXT_PUBLIC_CDN_WORKER_ENDPOINT}/assets`,
        {
          method: "PUT",
          body: buffer,
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      if (response.ok) {
        await uploadComplete.mutateAsync({ classId });
      }
    },
  });

  const create = api.classes.create.useMutation({
    onSuccess: async (data) => {
      await uploadLogo.mutateAsync({ classId: data.id });
    },
  });

  const createMethods = useForm<CreateClassFormInputs>({
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors },
  } = createMethods;

  const onInputFile = (e: FileEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) {
      return;
    }

    const limit = 10 * 1000000; // max limit 10 MB
    const file = e.target.files[0]!;

    if (file.size > limit) {
      // onError?.(
      //   `That file is too large! Max file size is ${limit / 1000000} MB`,
      // );
    } else {
      setFile(file);
      setTimeout(() => {
        console.log("FILE", result);
      }, 100);
    }
  };

  const onSubmit: SubmitHandler<CreateClassFormInputs> = async (data) => {
    await create.mutateAsync(data);
  };

  return (
    <WizardLayout
      title="Create a new class"
      seoTitle="New Class"
      description="Create a class to manage students and create assignments."
      steps={4}
      currentStep={0}
    >
      <form onSubmit={createMethods.handleSubmit(onSubmit)}>
        <Card p="8" variant="outline" shadow="lg" rounded="lg">
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
                    borderColor={result ? "white" : "gray.200"}
                    _dark={{
                      borderColor: result ? "gray.800" : "white",
                    }}
                    overflow="hidden"
                  >
                    <ClassLogo
                      url={result ? (result as string) : undefined}
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
                      <Button
                        isDisabled={!result}
                        onClick={() => setFile(null)}
                      >
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
