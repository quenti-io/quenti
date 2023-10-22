import { useRouter } from "next/router";
import React from "react";

import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconArrowRight,
  IconAt,
  IconCircleDot,
  IconDiscountCheck,
} from "@tabler/icons-react";

import { useOrganization } from "../../hooks/use-organization";
import { OrganizationLogo } from "./organization-logo";
import { getBaseDomain } from "./utils/get-base-domain";
import { useOnboardingStep } from "./utils/use-onboarding-step";

const OrgDisplayRaw = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const onboardingStep = useOnboardingStep();

  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);

  const isLoaded = !!org;

  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <HStack spacing="6">
      <Skeleton isLoaded={isLoaded} fitContent rounded="full">
        <Center
          w="16"
          h="16"
          rounded="full"
          bg="white"
          overflow="hidden"
          shadow="md"
        >
          <OrganizationLogo
            width={64}
            height={64}
            hash={org?.logoHash || ""}
            url={org?.logoUrl || ""}
          />
        </Center>
      </Skeleton>
      <Stack spacing={onboardingStep ? 2 : 0} flex="1" overflow="hidden">
        <Flex h="43.2px" alignItems="center" w="full">
          <SkeletonText
            isLoaded={isLoaded}
            fitContent
            noOfLines={1}
            skeletonHeight="36px"
            maxW="full"
          >
            <HStack w="full">
              <Heading
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                maxW="full"
              >
                {org?.name || "Loading..."}
              </Heading>
              {org?.published ? (
                <Box color="blue.300">
                  <Tooltip label="Verified organization">
                    <IconDiscountCheck aria-label="Verified" />
                  </Tooltip>
                </Box>
              ) : (
                <Box color="gray.500">
                  <Tooltip label="Not published">
                    <IconCircleDot aria-label="Not published" />
                  </Tooltip>
                </Box>
              )}
            </HStack>
          </SkeletonText>
        </Flex>
        {isLoaded && onboardingStep && (
          <Button
            leftIcon={<IconArrowRight size={16} />}
            w="max"
            size="sm"
            variant="outline"
            onClick={() => {
              void router.push(`/orgs/${id}/${onboardingStep}`);
            }}
          >
            <Text fontSize="xs">Continue setup</Text>
          </Button>
        )}
        {domain?.domain && (
          <Flex h="21px" alignItems="center">
            <SkeletonText
              noOfLines={1}
              fitContent
              w="max-content"
              isLoaded={isLoaded}
              skeletonHeight="10px"
            >
              <HStack spacing="1" color={mutedColor}>
                <IconAt size="16" />
                <Text fontSize="sm">{domain?.domain}</Text>
              </HStack>
            </SkeletonText>
          </Flex>
        )}
      </Stack>
    </HStack>
  );
};

export const OrgDisplay = React.memo(OrgDisplayRaw);
