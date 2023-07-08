import {
  Container,
  Tab,
  TabList,
  Tabs,
  useColorModeValue,
} from "@chakra-ui/react";
import { WithFooter } from "../../../components/with-footer";

export default function OrganizationsPage() {
  const borderColor = useColorModeValue("gray.300", "gray.700");

  return (
    <WithFooter>
      <Container maxW="6xl">
        <Tabs borderColor={borderColor}>
          <TabList gap="6">
            <Tab px="0" bg="none" fontWeight={600}>
              Organization
            </Tab>
            <Tab px="0" bg="none" fontWeight={600}>
              Members
            </Tab>
            <Tab px="0" bg="none" fontWeight={600}>
              Settings
            </Tab>
          </TabList>
        </Tabs>
      </Container>
    </WithFooter>
  );
}
