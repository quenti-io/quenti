import {
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@quenti/trpc";
import { IconArrowRight } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { WizardLayout } from "../../components/wizard-layout";
import { ORGANIZATION_ICONS } from "../../utils/icons";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Enter a name" })
    .max(50, { message: "Name must be less than 50 characters" }),
  icon: z.number().int().min(0),
});

interface NewOrganizationFormInput {
  name: string;
  icon: number;
}

export default function NewOrganization() {
  const utils = api.useContext();
  const router = useRouter();

  const create = api.organizations.create.useMutation({
    onSuccess: async (data) => {
      await utils.user.me.invalidate();
      await router.push(`/orgs/${data.id}/members-onboarding`);
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
      icon: 0,
    },
    resolver: zodResolver(schema),
  });

  const {
    formState: { errors },
  } = newOrganizationFormMethods;

  const onSubmit: SubmitHandler<NewOrganizationFormInput> = async (data) => {
    await create.mutateAsync(data);
  };

  const iconColor = useColorModeValue("#171923", "white");

  return (
    <WizardLayout
      title="Create a new organization"
      description="Create an organization to manage teachers and students."
      steps={5}
      currentStep={0}
    >
      <form onSubmit={newOrganizationFormMethods.handleSubmit(onSubmit)}>
        <Card p="8" variant="outline" shadow="lg" rounded="lg">
          <Stack spacing="10">
            <Stack spacing="6">
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
              <Controller
                name="icon"
                control={newOrganizationFormMethods.control}
                render={({ field: { value, onChange } }) => (
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
                              variant={value == i ? "solid" : "ghost"}
                              aria-label="Icon"
                              onClick={() => onChange(i)}
                              icon={
                                <Icon
                                  size={18}
                                  style={{ transition: "all 300ms" }}
                                  color={value == i ? "white" : iconColor}
                                />
                              }
                            />
                          </Skeleton>
                        </Box>
                      ))}
                    </Box>
                  </FormControl>
                )}
              />
            </Stack>
            <ButtonGroup w="full" size="sm">
              <Button variant="outline" w="full" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                w="full"
                rightIcon={<IconArrowRight size="18" />}
                type="submit"
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
