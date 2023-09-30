import { Link } from "@quenti/components";

import {
  Box,
  Card,
  HStack,
  Heading,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconAlertCircleFilled } from "@tabler/icons-react";

import { ORG_SUPPORT_EMAIL } from "../../../../../packages/lib/constants/email";

interface DomainConflictCardProps {
  domain: string;
}

export const DomainConflictCard: React.FC<DomainConflictCardProps> = ({
  domain,
}) => {
  const cardBg = useColorModeValue("white", "gray.750");
  const mutedColor = useColorModeValue("gray.700", "gray.300");
  const linkDefault = useColorModeValue("gray.900", "whiteAlpha.900");
  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <SlideFade in>
      <Card
        rounded="xl"
        px="4"
        py="3"
        shadow="md"
        borderLeftColor="orange.400"
        borderLeftWidth="2px"
        bg={cardBg}
      >
        <Stack spacing="3">
          <HStack>
            <Box w="18px" h="18px" color="orange.400">
              <IconAlertCircleFilled size={18} />
            </Box>
            <Heading size="sm">{domain} is already verified</Heading>
          </HStack>
          <Text fontSize="sm" color={mutedColor}>
            This domain has already been verified by another organization.
            Please reach out to us at{" "}
            <Link
              href={`mailto:${ORG_SUPPORT_EMAIL}`}
              color={linkDefault}
              fontWeight={700}
              transition="color 0.2s ease-in-out"
              _hover={{ color: highlight }}
            >
              {ORG_SUPPORT_EMAIL}
            </Link>{" "}
            before publishing so that we can resolve this issue.
          </Text>
        </Stack>
      </Card>
    </SlideFade>
  );
};
