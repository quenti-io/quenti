import {
  Button,
  Container,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import type { Organization } from "@prisma/client";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Link } from "../../components/link";
import { WithFooter } from "../../components/with-footer";
import { OrganizationCard } from "../../modules/organizations/organization-card";
import { api } from "../../utils/api";

export default function Organizations() {
  const router = useRouter();
  const utils = api.useContext();
  const toast = useToast();

  const { data } = api.organizations.getBelonging.useQuery(undefined, {
    retry: false,
  });

  const [tokenChecked, setTokenChecked] = React.useState(false);

  const acceptToken = api.organizations.acceptToken.useMutation({
    onSuccess: async (name) => {
      await utils.organizations.getBelonging.invalidate();

      toast({
        title: `You have been invited to ${name}`,
        icon: <AnimatedCheckCircle />,
        containerStyle: { marginBottom: "2rem", marginTop: "-1rem" },
      });
    },
    onSettled: () => {
      setTokenChecked(true);
    },
  });

  const [search, setSearch] = React.useState("");
  const filterFn = (org: Organization) => {
    if (!search) return true;
    return org.name.toLowerCase().includes(search.toLowerCase());
  };

  React.useEffect(() => {
    if (!router.isReady) return;
    if (router.query.token)
      acceptToken.mutate({ token: router.query.token as string });
    else setTokenChecked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const menuBg = useColorModeValue("white", "gray.800");

  const isLoading = !data || !tokenChecked;

  return (
    <WithFooter>
      <Container maxW="6xl">
        <Stack spacing="8">
          <Heading size="lg">Organizations</Heading>
          <HStack>
            <InputGroup bg={menuBg} shadow="sm" rounded="md">
              <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
                <IconSearch size={18} />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                pl="44px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button px="6" as={Link} href="/orgs/new">
              Create New
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap="4">
            {!isLoading
              ? data
                  .filter(filterFn)
                  .map((org) => (
                    <OrganizationCard
                      id={org.id}
                      name={org.name}
                      slug={org.slug}
                      icon={org.icon}
                      key={org.id}
                      accepted={org.accepted}
                    />
                  ))
              : Array.from({ length: 12 }).map((_, i) => (
                  <OrganizationCard
                    id=""
                    name="loading"
                    slug=""
                    skeleton
                    key={i}
                  />
                ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </WithFooter>
  );
}
