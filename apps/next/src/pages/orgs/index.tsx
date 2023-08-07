import {
  Button,
  Container,
  Heading,
  SlideFade,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconExternalLink, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { Link } from "../../components/link";
import { Loading } from "../../components/loading";
import { WithFooter } from "../../components/with-footer";

export default function Organizations() {
  const session = useSession();
  if (!session.data?.user) return <Loading />;

  const domain = session.data.user.email!.split("@")[1]!;

  return (
    <WithFooter>
      <SlideFade
        in={true}
        offsetY="20px"
        delay={0.2}
        transition={{
          enter: {
            duration: 0.3,
          },
        }}
      >
        <Container maxW="4xl" mt="20">
          <VStack spacing="12">
            <VStack spacing="6">
              <Heading
                as="h1"
                fontSize={["4xl", "4xl", "5xl", "7xl"]}
                textAlign="center"
                maxW="1000px"
                bgGradient="linear(to-r, blue.300, purple.300)"
                bgClip="text"
                data-aos="fade-up"
              >
                Manage your school with Quenti
              </Heading>
              <Text fontSize="xl" textAlign="center">
                Quenti&apos;s organizations give you a powerful set of tools for
                managing your school&apos;s classes, teachers and students. Get
                started by creating an organization for{" "}
                <strong>{domain}</strong>.
              </Text>
            </VStack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Button
                size="lg"
                height="4rem"
                px="2rem"
                leftIcon={<IconPlus />}
                as={Link}
                href="/orgs/new"
              >
                Get started
              </Button>
              <Button
                variant="ghost"
                size="lg"
                height="4rem"
                px="2rem"
                rightIcon={<IconExternalLink />}
              >
                Learn more
              </Button>
            </Stack>
          </VStack>
        </Container>
      </SlideFade>
    </WithFooter>
  );
}
