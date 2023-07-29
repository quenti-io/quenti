import {
  Card,
  Flex,
  Stack,
  useColorModeValue,
  Text,
  Heading,
  Button,
} from "@chakra-ui/react";
import { DefaultLayout } from "./default-layout";
import { PresentWrapper } from "./present-wrapper";
import { Link } from "../../components/link";
import { IconBrandTwitterFilled } from "@tabler/icons-react";

export const OnboardingSubscribe = () => {
  const cardBg = useColorModeValue("white", "gray.750");
  const muted = useColorModeValue("gray.600", "gray.400");

  return (
    <PresentWrapper step={5}>
      <DefaultLayout
        heading="Subscribe to updates"
        description="We're always adding new features and improvements. Want to stay in the loop?"
        nextUrl="/onboarding/done"
      >
        <Card bg={cardBg} shadow="lg" p="6" w="md">
          <Flex justifyContent="space-between" alignItems="center">
            <Stack spacing="0">
              <Heading fontSize="md">Follow us on Twitter</Heading>
              <Text fontSize="sm" color={muted}>
                Features, tips, tricks, etc.
              </Text>
            </Stack>
            <Button
              as={Link}
              href="https://twitter.com/quentiapp"
              leftIcon={<IconBrandTwitterFilled size={18} />}
            >
              @quentiapp
            </Button>
          </Flex>
        </Card>
      </DefaultLayout>
    </PresentWrapper>
  );
};
