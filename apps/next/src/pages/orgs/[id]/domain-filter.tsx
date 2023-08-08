import {
  Box,
  Button,
  ButtonGroup,
  Card,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";
import { api } from "@quenti/trpc";
import { refineRegex } from "@quenti/trpc/server/common/validation";
import {
  IconArrowLeft,
  IconHash,
  IconSchool,
  IconUnderline,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Link } from "../../../components/link";
import { WizardLayout } from "../../../components/wizard-layout";
import { useOrganization } from "../../../hooks/use-organization";
import { getBaseDomain } from "../../../modules/organizations/utils/get-base-domain";

const schema = z.object({
  filter: z
    .string()
    .nonempty({ message: "Enter a regular expression" })
    .refine(...refineRegex),
});

interface DomainFilterFormInputs {
  filter: string;
}

export default function OrgDomainFilter() {
  const router = useRouter();

  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);

  const domainFilterMethods = useForm<DomainFilterFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      filter: "^[^0-9]",
    },
  });
  const {
    formState: { errors },
  } = domainFilterMethods;

  const setDomainFilter = api.organizations.setDomainFilter.useMutation({
    onSuccess: async () => {
      await router.push(`/orgs/${org!.id}/publish`);
    },
  });

  const watchFilter = domainFilterMethods.watch("filter");
  const [testValue, setTestValue] = React.useState("");

  const testValid =
    z
      .string()
      .email()
      .safeParse(`${testValue}@${domain?.requestedDomain || ""}`).success ||
    !testValue.trim().length;

  const evaluate = () => {
    try {
      return new RegExp(watchFilter).test(testValue);
    } catch {
      return false;
    }
  };
  const evaluation = evaluate();

  const onSubmit: SubmitHandler<DomainFilterFormInputs> = async (data) => {
    await setDomainFilter.mutateAsync({
      orgId: org!.id,
      domainId: domain!.id,
      filter: data.filter,
    });
  };

  const linkDefault = useColorModeValue("gray.700", "gray.300");
  const highlight = useColorModeValue("blue.500", "blue.200");
  const addonBg = useColorModeValue("gray.100", "gray.750");
  const error = useColorModeValue("red.600", "red.300");

  return (
    <WizardLayout
      title="Set up a domain filter"
      description={
        <>
          Set up a filter to determine if an email address is associated with a
          teacher or student account. Your domain&apos;s filter is a{" "}
          <Link
            href="https://www.janmeppe.com/blog/regex-for-noobs/"
            transition="color 0.2s ease-in-out"
            textDecoration="underline"
            _hover={{ color: highlight }}
            target="_blank"
          >
            regular expression
          </Link>{" "}
          that evaluates to true when an email belongs to a teacher. Take a look
          at a few examples below or write one for your own use case.
          <br />
          <br />
          Need help or have a more difficult scenario? Feel free to reach out to
          us at{" "}
          <Link
            href={`mailto:${ORG_SUPPORT_EMAIL}`}
            color={linkDefault}
            fontWeight={700}
            transition="color 0.2s ease-in-out"
            _hover={{ color: highlight }}
          >
            {ORG_SUPPORT_EMAIL}
          </Link>
          .
        </>
      }
      steps={5}
      currentStep={3}
    >
      <form onSubmit={domainFilterMethods.handleSubmit(onSubmit)}>
        <Stack spacing="5">
          <Box px="8">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Skeleton rounded="md" isLoaded={!!domain}>
                <ExampleCard
                  title="Doesn't start with a number"
                  description="For example, students' emails start with their year of graduation"
                  isSelected={watchFilter === "^[^0-9]"}
                  icon={<IconHash size={18} />}
                  onClick={() =>
                    domainFilterMethods.setValue("filter", "^[^0-9]")
                  }
                />
              </Skeleton>
              <Skeleton rounded="md" isLoaded={!!domain}>
                <ExampleCard
                  title="Contains an underscore"
                  description="Teachers have a separate convention for emails with an underscore"
                  isSelected={watchFilter === ".*_.*"}
                  icon={<IconUnderline size={18} />}
                  onClick={() =>
                    domainFilterMethods.setValue("filter", ".*_.*")
                  }
                />
              </Skeleton>
            </SimpleGrid>
          </Box>
          <Skeleton rounded="lg" isLoaded={!!domain}>
            <Card p="8" variant="outline" shadow="lg" rounded="lg">
              <Stack spacing="8">
                <Stack spacing="6">
                  <Stack spacing="6">
                    <Controller
                      name="filter"
                      control={domainFilterMethods.control}
                      render={({ field: { value, onChange } }) => (
                        <FormControl isInvalid={!!errors.filter}>
                          <FormLabel fontSize="sm" mb="10px" color="gray.500">
                            Regular expression •{" "}
                            <Link
                              href="https://www.janmeppe.com/blog/regex-for-noobs/"
                              transition="color 0.2s ease-in-out"
                              _hover={{ color: highlight }}
                              target="_blank"
                            >
                              learn more
                            </Link>
                          </FormLabel>
                          <Input
                            placeholder="^[^0-9]"
                            fontFamily="mono"
                            value={value}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {errors.filter?.message}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    />
                  </Stack>
                  <Stack spacing="3">
                    <FormControl>
                      <FormLabel fontSize="sm" mb="10px" color="gray.500">
                        Test your filter
                      </FormLabel>
                      <InputGroup>
                        <Input
                          placeholder="email"
                          value={testValue}
                          onChange={(e) => setTestValue(e.target.value)}
                        />
                        <InputRightAddon bg={addonBg}>
                          @{domain?.requestedDomain || ""}
                        </InputRightAddon>
                      </InputGroup>
                    </FormControl>
                    <HStack
                      color={testValid ? undefined : error}
                      transition="color 0.15s ease-in-out"
                    >
                      {evaluation && testValue.trim().length ? (
                        <IconSchool size={16} />
                      ) : (
                        <IconUser size={16} />
                      )}
                      <Text fontSize="sm">
                        {testValue.trim().length && testValid ? (
                          <>
                            {testValue}@{domain?.requestedDomain || ""} is a{" "}
                            <strong>
                              {evaluation ? "teacher" : "student"}
                            </strong>
                          </>
                        ) : testValid ? (
                          "Enter an email to test your filter"
                        ) : (
                          "Enter a valid email"
                        )}
                      </Text>
                    </HStack>
                  </Stack>
                </Stack>
                <ButtonGroup w="full" size="sm">
                  <Button
                    w="full"
                    variant="outline"
                    leftIcon={<IconArrowLeft size={18} />}
                    colorScheme="gray"
                    onClick={() => router.back()}
                  >
                    Go back
                  </Button>
                  <Button w="full" type="submit">
                    Create filter
                  </Button>
                </ButtonGroup>
              </Stack>
            </Card>
          </Skeleton>
        </Stack>
      </form>
    </WizardLayout>
  );
}

interface ExampleCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}

const ExampleCard = ({
  title,
  description,
  isSelected,
  icon,
  onClick,
}: ExampleCardProps) => {
  const muted = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.750");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Card
      bg={cardBg}
      p="4"
      shadow="lg"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s ease-in-out"
      outline="solid 2px"
      outlineColor={isSelected ? "blue.300" : "transparent"}
      _hover={{
        bg: hoverBg,
      }}
    >
      <Stack>
        <HStack>
          {icon}
          <Heading size="sm">{title}</Heading>
        </HStack>
        <Text fontSize="sm" color={muted}>
          {description}
        </Text>
      </Stack>
    </Card>
  );
};
