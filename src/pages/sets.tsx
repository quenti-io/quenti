import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import {
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const { data, isLoading } = api.studySets.getAll.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");
  const termsTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="7xl" marginTop="10">
      <Stack spacing={6}>
        <Heading color="gray.400" size="lg">
          My Sets
        </Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap="6">
          {isLoading &&
            Array.from({ length: 9 }).map((_, i) => (
              <GridItem minHeight="36" key={i}>
                <Skeleton
                  rounded="md"
                  height="full"
                  border="2px"
                  borderColor="gray.700"
                />
              </GridItem>
            ))}
          {(data || []).map((x) => (
            <GridItem key={x.id}>
              <LinkBox
                as="article"
                h="full"
                rounded="md"
                p="5"
                bg={linkBg}
                borderColor={linkBorder}
                borderWidth="2px"
                shadow="lg"
                transition="all ease-in-out 150ms"
                _hover={{ transform: "translateY(-2px)" }}
              >
                <Stack>
                  <Heading size="lg">
                    <LinkOverlay href={`/sets/${x.id}`}>{x.title}</LinkOverlay>
                  </Heading>
                  <Text color={termsTextColor}>{x._count.terms} terms</Text>
                </Stack>
              </LinkBox>
            </GridItem>
          ))}
          {!isLoading && (
            <Button
              as={Link}
              href="/sets/create"
              height="full"
              variant="outline"
              gap="2"
              minHeight="28"
            >
              <IconPlus />
              Create a Set
            </Button>
          )}
        </Grid>
      </Stack>
    </Container>
  );
};

export { getServerSideProps } from "../components/chakra";

export default Home;
