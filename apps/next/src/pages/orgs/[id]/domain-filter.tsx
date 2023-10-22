import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { ORG_SUPPORT_EMAIL } from "@quenti/lib/constants/email";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconArrowLeft, IconHash, IconUnderline } from "@tabler/icons-react";

import { PageWrapper } from "../../../common/page-wrapper";
import { WizardLayout } from "../../../components/wizard-layout";
import { useOrganization } from "../../../hooks/use-organization";
import { getLayout } from "../../../layouts/main-layout";
import { DomainFilterForm } from "../../../modules/organizations/domain-filter-form";
import { OnboardingMetadata } from "../../../modules/organizations/onboarding-metadata";
import { getBaseDomain } from "../../../modules/organizations/utils/get-base-domain";

export default function OrgDomainFilter() {
  const router = useRouter();
  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);

  const ref = React.useRef<{ setFilter: (filter: string) => void }>();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [filter, setFilter] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const linkDefault = useColorModeValue("gray.700", "gray.300");
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <OnboardingMetadata step="domain-filter">
      <WizardLayout
        title="Set up a domain filter"
        seoTitle="Domain Filter"
        description={
          <>
            Set up a filter to determine if an email address is associated with
            a teacher or student account. Your domain&apos;s filter is a{" "}
            <Link
              href="https://www.janmeppe.com/blog/regex-for-noobs/"
              transition="color 0.2s ease-in-out"
              textDecoration="underline"
              _hover={{ color: highlight }}
              target="_blank"
            >
              regular expression
            </Link>{" "}
            that evaluates to true when an email belongs to a teacher. Take a
            look at a few examples below or write one for your own use case.
            <br />
            <br />
            Need help or have a more difficult scenario? Feel free to reach out
            to us at{" "}
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
        <Stack spacing="5">
          <Box px="8">
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Skeleton rounded="md" isLoaded={!!domain}>
                <ExampleCard
                  title="Doesn't start with a number"
                  description="For example, students' emails start with their year of graduation"
                  isSelected={filter === "^[^0-9]"}
                  icon={<IconHash size={18} />}
                  onClick={() => {
                    ref.current!.setFilter("^[^0-9]");
                  }}
                />
              </Skeleton>
              <Skeleton rounded="md" isLoaded={!!domain}>
                <ExampleCard
                  title="Contains an underscore"
                  description="Teachers have a separate convention for emails with an underscore"
                  isSelected={filter === ".*_.*"}
                  icon={<IconUnderline size={18} />}
                  onClick={() => {
                    ref.current!.setFilter(".*_.*");
                  }}
                />
              </Skeleton>
            </SimpleGrid>
          </Box>
          <Skeleton rounded="lg" isLoaded={!!domain}>
            <Card p="8" variant="outline" shadow="lg" rounded="lg">
              <DomainFilterForm
                ref={ref}
                formRef={formRef}
                onSuccess={async () => {
                  await router.push(`/orgs/${org!.id}/publish`);
                }}
                onChangeFilter={setFilter}
                onChangeLoading={setLoading}
              >
                <ButtonGroup w="full">
                  <Button
                    w="full"
                    variant="outline"
                    leftIcon={<IconArrowLeft size={18} />}
                    colorScheme="gray"
                    onClick={() => router.back()}
                    fontSize="sm"
                  >
                    Go back
                  </Button>
                  <Button
                    w="full"
                    type="submit"
                    isLoading={loading}
                    fontSize="sm"
                  >
                    Create filter
                  </Button>
                </ButtonGroup>
              </DomainFilterForm>
            </Card>
          </Skeleton>
        </Stack>
      </WizardLayout>
    </OnboardingMetadata>
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
      h="full"
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

OrgDomainFilter.PageWrapper = PageWrapper;
OrgDomainFilter.getLayout = getLayout;
