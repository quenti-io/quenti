import {
  Avatar,
  Container,
  Divider,
  Heading,
  HStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import type { ComponentWithAuth } from "../components/auth-component";
import { DangerZone } from "../modules/settings/danger-zone";
import { GAccountInfo } from "../modules/settings/g-account-info";
import { ProfileInfo } from "../modules/settings/profile-info";
import { avatarUrl } from "../utils/avatar";

const Settings: ComponentWithAuth = () => {
  const session = useSession()!.data!;
  const divider = useColorModeValue("gray.400", "gray.600");

  return (
    <Container maxW="4xl" marginTop="10" marginBottom="20">
      <Stack spacing={12}>
        <HStack spacing={4}>
          <Avatar
            src={avatarUrl({ ...session.user!, image: session.user!.image! })}
            size="sm"
          />
          <Heading>Settings</Heading>
        </HStack>
        <Stack spacing={8}>
          <GAccountInfo />
          <Divider borderColor={divider} />
          <ProfileInfo />
          <Divider borderColor={divider} />
          <DangerZone />
        </Stack>
      </Stack>
    </Container>
  );
};

Settings.authenticationEnabled = true;

export { getServerSideProps } from "../components/chakra";

export default Settings;
