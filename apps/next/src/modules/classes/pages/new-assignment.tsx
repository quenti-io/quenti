import { useRouter } from "next/router";
import React from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { IconHelpCircle } from "@tabler/icons-react";

import { SkeletonLabel } from "../../../components/skeleton-label";
import { DescriptionEditor } from "../assignments/new/description-editor";
import { TypeSection } from "../assignments/new/type-section";
import { ClassWizardLayout } from "../class-wizard-layout";
import { DateTimeInput } from "../date-time-input";
import { useProtectedRedirect } from "../use-protected-redirect";

export const NewAssignment = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const isLoaded = useProtectedRedirect();

  const [availableAt, setAvailableAt] = React.useState<string | null>(
    new Date().toISOString(),
  );
  const [dueAt, setDueAt] = React.useState<string | null>(null);
  const [lockedAt, setLockedAt] = React.useState<string | null>(null);

  return (
    <ClassWizardLayout
      title="New assignment"
      seoTitle="New assignment"
      currentStep={0}
      steps={5}
      description=""
    >
      <Stack spacing="8">
        <Stack>
          <SkeletonLabel isLoaded={isLoaded}>Title</SkeletonLabel>
          <Skeleton
            rounded="lg"
            w="full"
            maxW={{ base: "full", md: "50%" }}
            isLoaded={isLoaded}
          >
            <Input
              w="full"
              autoFocus
              rounded="lg"
              placeholder="Assignment Title"
              bg="white"
              shadow="sm"
              _dark={{
                bg: "gray.800",
              }}
            />
          </Skeleton>
        </Stack>
        <TypeSection />
        <Stack spacing="8" mt="6">
          <HStack
            spacing="6"
            display={{ base: "grid", lg: "flex" }}
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
          >
            <Stack>
              <SkeletonLabel isLoaded={isLoaded}>Available at</SkeletonLabel>
              <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                <DateTimeInput
                  value={availableAt}
                  onChange={setAvailableAt}
                  inputStyles={{
                    w: { base: "full", sm: "244px" },
                  }}
                />
              </Skeleton>
            </Stack>
            <Box
              w="2px"
              bg="gray.200"
              _dark={{ bg: "gray.700" }}
              h="56px"
              rounded="full"
              display={{ base: "none", lg: "inherit" }}
            />
            <Stack>
              <SkeletonLabel isLoaded={isLoaded}>
                Due at (optional)
              </SkeletonLabel>
              <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                <DateTimeInput
                  value={dueAt}
                  onChange={setDueAt}
                  placeholder="Set due date"
                  inputStyles={{
                    w: { base: "full", sm: "244px" },
                  }}
                  nullable
                />
              </Skeleton>
            </Stack>
            <Box
              w="2px"
              bg="gray.200"
              _dark={{ bg: "gray.700" }}
              h="56px"
              rounded="full"
              display={{ base: "none", lg: "inherit" }}
            />
            <Stack>
              <SkeletonLabel isLoaded={isLoaded}>
                <HStack>
                  <Text>Locked at (optional)</Text>
                  <Tooltip
                    label="Students will not be able to submit or make any changes after this date."
                    placement="top"
                    p="2"
                    px="3"
                  >
                    <Box color="gray.500">
                      <IconHelpCircle size={16} />
                    </Box>
                  </Tooltip>
                </HStack>
              </SkeletonLabel>
              <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                <DateTimeInput
                  value={lockedAt}
                  onChange={setLockedAt}
                  placeholder="Set lock date"
                  inputStyles={{
                    w: { base: "full", sm: "244px" },
                  }}
                  nullable
                />
              </Skeleton>
            </Stack>
          </HStack>
        </Stack>
        <Stack>
          <SkeletonLabel isLoaded={isLoaded}>
            Description (optional)
          </SkeletonLabel>
          <Skeleton rounded="lg" isLoaded={isLoaded} w="full">
            <DescriptionEditor />
          </Skeleton>
        </Stack>
        <Flex w="full" justifyContent="end">
          <ButtonGroup>
            <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
              <Button
                variant="ghost"
                colorScheme="gray"
                onClick={async () => {
                  await router.push(`/classes/${id}/assignments`);
                }}
              >
                Cancel
              </Button>
            </Skeleton>
            <Skeleton rounded="lg" isLoaded={isLoaded} fitContent>
              <Button>Create</Button>
            </Skeleton>
          </ButtonGroup>
        </Flex>
      </Stack>
    </ClassWizardLayout>
  );
};
