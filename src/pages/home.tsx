import { useSession } from "next-auth/react";

import {
  Avatar,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { ComponentWithAuth } from "../components/auth-component";
import { api } from "../utils/api";

const Home: ComponentWithAuth = () => {
  const { data: session } = useSession();

  const { data, isLoading } = api.studySets.recent.useQuery(undefined, {
    enabled: session?.user !== undefined,
  });

  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");
  const termsTextColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Container maxW="7xl" marginTop="10">
      <Stack spacing={6}>
        <Heading color={headingColor} size="md">
          Recent
        </Heading>
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
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
                _hover={{
                  transform: "translateY(-2px)",
                  borderBottomColor: "blue.300",
                }}
              >
                <Flex
                  justifyContent="space-between"
                  flexDir="column"
                  h="full"
                  gap={4}
                >
                  <Stack spacing={1}>
                    x
                    <Heading size="md">
                      <LinkOverlay href={`/${x.id}`}>{x.title}</LinkOverlay>
                    </Heading>
                    <Text color={termsTextColor} fontSize="sm">
                      {x._count.terms} terms
                    </Text>
                  </Stack>
                  <HStack gap="2px">
                    <Avatar src={x.user.image} size="xs" />
                    <Text fontSize="sm" fontWeight={600}>
                      {x.user.name}
                    </Text>
                  </HStack>
                </Flex>
              </LinkBox>
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
};

Home.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Home;
