import {
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconAdjustments, IconUserCircle } from "@tabler/icons-react";
import type { ComponentWithAuth } from "../components/auth-component";
import { Link } from "../components/link";
import { WithFooter } from "../components/with-footer";
import { useAdmin } from "../hooks/use-admin";
import { AdminDashboard } from "../modules/admin/dashboard";
import { AdminEmails } from "../modules/admin/emails";
import { AdminUsers } from "../modules/admin/users";
import { HydrateAdmin } from "../modules/hydrate-admin";

const Admin: ComponentWithAuth = () => {
  const secondary = useColorModeValue("blue.300", "blue.200");
  const accent = useColorModeValue("orange.500", "orange.300");
  const borderColor = useColorModeValue("gray.300", "gray.750");

  return (
    <HydrateAdmin>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={8}>
            <Flex
              justifyContent="space-between"
              flexDir={{ base: "column", sm: "row" }}
              gap={{ base: 6, sm: 0 }}
            >
              <Stack spacing={4}>
                <HStack color={secondary}>
                  <IconUserCircle size={20} />
                  <Heading size="sm">Admin Dashboard</Heading>
                </HStack>
                <Heading size="2xl">
                  Welcome,{" "}
                  <Heading size="2xl" display="inline" color={accent}>
                    Ethan
                  </Heading>
                </Heading>
                <Text>You look great today!</Text>
              </Stack>
              <DashboardButton />
            </Flex>
            <Stack spacing={8}>
              <AdminDashboard />
              <Tabs borderColor={borderColor}>
                <TabList gap="6">
                  <Tab px="0" bg="none" fontWeight={600}>
                    Manage Users
                  </Tab>
                  <Tab px="0" bg="none" fontWeight={600}>
                    Emails
                  </Tab>
                </TabList>
                <TabPanels mt="6">
                  <TabPanel px="0">
                    <AdminUsers />
                  </TabPanel>
                  <TabPanel px="0">
                    <AdminEmails />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </Stack>
        </Container>
      </WithFooter>
    </HydrateAdmin>
  );
};

const DashboardButton = () => {
  const { grafanaUrl } = useAdmin();

  if (!grafanaUrl) {
    return (
      <Button leftIcon={<IconAdjustments />} isDisabled>
        Dashboard
      </Button>
    );
  }

  return (
    <Button leftIcon={<IconAdjustments />} as={Link} href={grafanaUrl}>
      Dashboard
    </Button>
  );
};

Admin.title = "Admin Dashboard";
Admin.authenticationEnabled = true;

export default Admin;
