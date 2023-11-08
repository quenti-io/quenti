import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import {
  Button,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  SlideFade,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconArrowRight, IconNewSection, IconUsers } from "@tabler/icons-react";

import { PageWrapper } from "../../../common/page-wrapper";
import { WizardLayout } from "../../../components/wizard-layout";
import { useClass } from "../../../hooks/use-class";
import { getLayout } from "../../../layouts/main-layout";
import { useProtectedRedirect } from "../../../modules/classes/use-protected-redirect";

interface CreateSectionsFormInputs {
  sections: string[];
}

const schema = z.object({
  sections: z
    .array(z.string().trim())
    .min(1)
    .max(10)
    .refine(
      (sections) => {
        return !!sections.find((s) => s.length > 0);
      },
      { message: "Enter at least one section" },
    ),
});

export default function CreateSections() {
  const utils = api.useUtils();
  const { data } = useClass();
  const router = useRouter();
  useProtectedRedirect();

  const bulkAddSections = api.classes.bulkAddSections.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      await router.push(`/classes/${data!.id}/done`);
    },
  });

  const createSectionsMethods = useForm<CreateSectionsFormInputs>({
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors },
  } = createSectionsMethods;

  const onSubmit: SubmitHandler<CreateSectionsFormInputs> = async (data) => {
    await bulkAddSections.mutateAsync({
      classId: router.query.id as string,
      sections: data.sections.filter((s) => s.length > 0),
    });
  };

  const iconColor = useColorModeValue("gray.800", "gray.200");
  const labelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <WizardLayout
      title="Create sections"
      seoTitle="Create Sections"
      description="With classes, students and assignments are organized into sections. Try creating a section for each individual period or block in your class, for example. You can always update your sections later."
      steps={4}
      currentStep={2}
    >
      <form onSubmit={createSectionsMethods.handleSubmit(onSubmit)}>
        <Card p="8" variant="outline" shadow="lg" rounded="xl">
          <Stack spacing="10">
            <Stack spacing="4">
              <FormLabel m="0" fontSize="sm" color={labelColor}>
                Add up to 10 sections
              </FormLabel>
              <Controller
                name="sections"
                control={createSectionsMethods.control}
                defaultValue={["", ""]}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.sections}>
                    <Stack spacing="3">
                      {value.map((section, index) => (
                        <SlideFade in key={index}>
                          <Stack spacing="0">
                            <InputGroup>
                              <InputLeftElement
                                pl="1"
                                color={
                                  value[index]?.length ? iconColor : "gray.500"
                                }
                              >
                                {value[index]?.length ? (
                                  <IconUsers size={18} />
                                ) : (
                                  <IconNewSection size={18} />
                                )}
                              </InputLeftElement>
                              <Input
                                autoFocus={index === 0}
                                placeholder={`Block ${index + 1}`}
                                isInvalid={index === 0 && !!errors.sections}
                                px="14px"
                                defaultValue={section}
                                onChange={(e) => {
                                  const sections = [...value];
                                  sections[index] = e.target.value;
                                  onChange(sections);
                                }}
                                onFocus={() => {
                                  if (
                                    value.length - 1 === index &&
                                    value.length < 10
                                  ) {
                                    onChange([...value, ""]);
                                  }
                                }}
                              />
                            </InputGroup>
                            {index === 0 && (
                              <FormErrorMessage>
                                {errors.sections?.message}
                              </FormErrorMessage>
                            )}
                          </Stack>
                        </SlideFade>
                      ))}
                    </Stack>
                  </FormControl>
                )}
              />
            </Stack>
            <Button
              w="full"
              rightIcon={<IconArrowRight size="18" />}
              type="submit"
              isLoading={bulkAddSections.isLoading}
            >
              Continue
            </Button>
          </Stack>
        </Card>
      </form>
    </WizardLayout>
  );
}

CreateSections.PageWrapper = PageWrapper;
CreateSections.getLayout = getLayout;
