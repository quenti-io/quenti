import {
  Card,
  Heading,
  Stack,
  useColorModeValue,
  Text,
  ScaleFade,
} from "@chakra-ui/react";
import { IconConfetti } from "@tabler/icons-react";

export const OrganizationWelcome = () => {
  const cardBg = useColorModeValue("white", "gray.750");
  const muted = useColorModeValue("gray.700", "gray.300");

  return (
    <ScaleFade in>
      <Card
        p="6"
        shadow="md"
        bg={cardBg}
        borderWidth="2px"
        borderColor="blue.300"
      >
        <Stack>
          <Heading size="md" display="inline-flex" alignItems="center" gap="2">
            <IconConfetti display="inline" />
            Welcome to your new organization!
          </Heading>
          <Text fontSize="sm" color={muted}>
            We&apos;re thrilled to have you on board!
            <br />
            Get started with managing teachers, students, billing and more.
          </Text>
        </Stack>
      </Card>
    </ScaleFade>
  );
};
