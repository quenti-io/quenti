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
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconArrowRight, IconSchool, IconUpload } from "@tabler/icons-react";

import { PageWrapper } from "../../common/page-wrapper";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { WizardLayout } from "../../components/wizard-layout";
import { useStudentRedirect } from "../../hooks/use-student-redirect";
import { getLayout } from "../../layouts/main-layout";

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
  useStudentRedirect("/home");

  const create = api.classes.create.useMutation({
    onSuccess: async (data) => {
      await router.push(`/classes/${data.id}/teachers-onboarding`);
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
                  <Center
                    rounded="xl"
                    minW="64px"
                    minH="64px"
                    bg="white"
                    border="solid 1px"
                    borderColor="gray.200"
                  >
                    <Box color="gray.900">
                      <IconSchool size={32} />
                    </Box>
                  </Center>
                  <Stack spacing="2">
                    <FormLabel m="0" fontWeight={700} fontSize="sm">
                      Class logo
                    </FormLabel>
                    <ButtonGroup
                      variant="outline"
                      colorScheme="gray"
                      size="sm"
                      fontSize="sm"
                    >
                      <Button leftIcon={<IconUpload size={18} />}>
                        Upload image
                      </Button>
                      <Button isDisabled>Remove</Button>
                    </ButtonGroup>
                    <Text color="gray.500" fontSize="xs">
                      *.png or *.jpeg files up to 10MB at least 400px by 400px
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
