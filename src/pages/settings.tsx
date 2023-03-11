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
import { Loading } from "../components/loading";
import { WithFooter } from "../components/with-footer";
import { useLoading } from "../hooks/use-loading";
import { AppPreferences } from "../modules/settings/app-preferences";
import { DangerZone } from "../modules/settings/danger-zone";
import { DataUsage } from "../modules/settings/data-usage";
import { GAccountInfo } from "../modules/settings/g-account-info";
import { ProfileInfo } from "../modules/settings/profile-info";
import { avatarUrl } from "../utils/avatar";

const Settings: ComponentWithAuth = () => {
  const session = useSession()!.data!;
  const divider = useColorModeValue("gray.400", "gray.600");

  const { loading } = useLoading();
  if (loading) return <Loading />;

  return (
    <WithFooter>
      <Container maxW="4xl">
        <Stack spacing={12}>
          <HStack spacing={4}>
            <Avatar
              src={avatarUrl({ ...session.user!, image: session.user!.image! })}
              size="sm"
              className="highlight-block"
            />
            <Heading>Settings</Heading>
          </HStack>
          <Stack spacing={8}>
            <GAccountInfo />
            <Divider borderColor={divider} />
            <ProfileInfo />
            <Divider borderColor={divider} />
            <AppPreferences />
            <Divider borderColor={divider} />
            <DataUsage />
            <Divider borderColor={divider} />
            <DangerZone />
          </Stack>
        </Stack>
      </Container>
    </WithFooter>
  );
};

Settings.title = "Settings";
Settings.authenticationEnabled = true;

export default Settings;
