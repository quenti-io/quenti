import { Link } from "@quenti/components";

import {
  Button,
  Card,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconBrandX } from "@tabler/icons-react";

import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";

export const OnboardingSubscribe = () => {
  const cardBg = useColorModeValue("white", "gray.750");
  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <PresentWrapper>
      <DefaultLayout
        heading="Subscribe to updates"
        seoTitle="Subscribe to Updates"
        description="We're always adding new features and improvements. Want to stay in the loop?"
      >
        <Card
          bg={cardBg}
          shadow="lg"
          p="6"
          w={{ base: "full", md: "md" }}
          mx="4"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap={{ base: "4", md: 0 }}
            flexDir={{
              base: "column",
              md: "row",
            }}
          >
            <Stack spacing="0">
              <Heading fontSize="md">Follow us on X</Heading>
              <Text fontSize="sm" color={muted}>
                Features, tips, tricks, etc.
              </Text>
            </Stack>
            <Button
              as={Link}
              href="https://twitter.com/quentiapp"
              leftIcon={<IconBrandX size={18} />}
              w={{ base: "full", md: "auto" }}
            >
              @quentiapp
            </Button>
          </Flex>
        </Card>
      </DefaultLayout>
    </PresentWrapper>
  );
};
