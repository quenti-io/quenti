import {
  Button,
  ButtonGroup,
  Card,
  HStack,
  Heading,
  SimpleGrid,
  Skeleton,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import {
  IconArrowLeft,
  IconFilterPlus,
  IconWorldPlus,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { WizardLayout } from "../../../components/wizard-layout";
import { useOrganization } from "../../../hooks/use-organization";
import { DomainForm } from "../../../modules/organizations/domain-form";
import { getBaseDomain } from "../../../modules/organizations/utils/get-base-domain";

export default function OrgDomainSetup() {
  const [newDomain, setNewDomain] = React.useState(false);

  return (
    <WizardLayout
      title="Set up your domain"
      description="Set up your organization's domain to start enrolling students. New and existing accounts with an associated email ending in your domain will be automatically enrolled once your organization is published."
      steps={5}
      currentStep={2}
    >
      {newDomain ? (
        <FormWrapper onBack={() => setNewDomain(false)} />
      ) : (
        <OptionsMenu onNewDomain={() => setNewDomain(true)} />
      )}
    </WizardLayout>
  );
}

interface OptionsMenuProps {
  onNewDomain: () => void;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ onNewDomain }) => {
  const router = useRouter();
  const { data: org } = useOrganization();
  const baseDomain = getBaseDomain(org);

  const muted = useColorModeValue("gray.700", "gray.300");
  const cardBg = useColorModeValue("white", "gray.750");
  const cardHover = useColorModeValue("gray.100", "gray.700");

  return (
    <SlideFade
      initial={{
        opacity: 0,
        transform: "translateY(-20px)",
      }}
      animate={{
        opacity: 1,
        transform: "translateY(0)",
      }}
      in
    >
      <Stack spacing="6">
        <SimpleGrid columns={{ base: 1, md: 2 }} gap="6">
          <Skeleton rounded="lg" isLoaded={!!org}>
            <Card
              p="6"
              shadow="md"
              rounded="lg"
              bg={cardBg}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
              _hover={{
                bg: cardHover,
                transform: "translateY(-8px)",
              }}
              onClick={onNewDomain}
            >
              <Stack spacing="3">
                <HStack>
                  <IconWorldPlus />
                  <Heading fontSize="lg">Separate domain</Heading>
                </HStack>
                <Text fontSize="sm" color={muted}>
                  Students&apos; email addresses end with a domain other than{" "}
                  <strong>{baseDomain}</strong>. Verify a separate domain for
                  students to be enrolled in your organization.
                </Text>
              </Stack>
            </Card>
          </Skeleton>
          <Skeleton rounded="lg" isLoaded={!!org}>
            <Card
              p="6"
              shadow="md"
              rounded="lg"
              bg={cardBg}
              transition="all 0.2s ease-in-out"
              cursor="pointer"
              _hover={{
                bg: cardHover,
                transform: "translateY(-8px)",
              }}
            >
              <Stack spacing="3">
                <HStack>
                  <IconFilterPlus />
                  <Heading fontSize="lg">Use {baseDomain}</Heading>
                </HStack>
                <Text fontSize="sm" color={muted}>
                  Set up a filter for your domain to determine if a new or
                  existing user should be enrolled as a teacher or a student.
                </Text>
              </Stack>
            </Card>
          </Skeleton>
        </SimpleGrid>
        <Button
          size="sm"
          w="max"
          variant="ghost"
          leftIcon={<IconArrowLeft size={18} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Stack>
    </SlideFade>
  );
};

interface FormWrapperProps {
  onBack: () => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ onBack }) => {
  const utils = api.useContext();

  const [loading, setLoading] = React.useState(false);
  const [shouldTransition, setShouldTransition] = React.useState(false);

  return (
    <SlideFade
      initial={{
        opacity: 0,
        transform: "translateY(-20px)",
      }}
      animate={{
        opacity: 1,
        transform: "translateY(0)",
      }}
      in
    >
      <Card p="8" variant="outline" shadow="lg" rounded="lg">
        <DomainForm
          onChangeLoading={setLoading}
          onSuccess={async () => {
            setShouldTransition(true);
            await utils.organizations.get.invalidate();
          }}
        >
          <ButtonGroup w="full" size="sm">
            <Button
              w="full"
              variant="outline"
              leftIcon={<IconArrowLeft size={18} />}
              onClick={onBack}
            >
              Go back
            </Button>
            <Button
              w="full"
              type="submit"
              isLoading={loading || shouldTransition}
            >
              Add domain
            </Button>
          </ButtonGroup>
        </DomainForm>
      </Card>
    </SlideFade>
  );
};
