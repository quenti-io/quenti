import { useSession } from "next-auth/react";
import React from "react";

import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  Container,
  Divider,
  HStack,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

import type { ComponentWithAuth } from "../components/auth-component";
import { Loading } from "../components/loading";
import { UnboundOnly } from "../components/unbound-only";
import { WithFooter } from "../components/with-footer";
import { useLoading } from "../hooks/use-loading";
import { useMe } from "../hooks/use-me";
import { AccountType } from "../modules/settings/account-type";
import { AppPreferences } from "../modules/settings/app-preferences";
import { DangerZone } from "../modules/settings/danger-zone";
import { DataUsage } from "../modules/settings/data-usage";
import { GAccountInfo } from "../modules/settings/g-account-info";
import { ProfileInfo } from "../modules/settings/profile-info";

export const SettingsContext = React.createContext<{
  layout?: "mobile" | "desktop";
}>({});

const Settings: ComponentWithAuth = () => {
  const session = useSession()!.data!;
  const { data: me } = useMe();
  const { loading } = useLoading();

  const layout: "mobile" | "desktop" | undefined = useBreakpointValue({
    base: "mobile",
    md: "desktop",
  });

  const divider = useColorModeValue("gray.400", "gray.600");

  if (loading || !layout || !me) return <Loading />;

  return (
    <WithFooter>
      <SettingsContext.Provider value={{ layout }}>
        <Container maxW="4xl">
          <Stack spacing={12}>
            <HStack spacing={4}>
              <Avatar
                src={avatarUrl({
                  ...session.user!,
                  image: session.user!.image!,
                })}
                size="sm"
                className="highlight-block"
              />
              <Heading>Settings</Heading>
            </HStack>
            <Stack spacing={8}>
              <GAccountInfo />
              <Divider borderColor={divider} />
              <UnboundOnly strict>
                <AccountType />
                <Divider borderColor={divider} />
              </UnboundOnly>
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
      </SettingsContext.Provider>
    </WithFooter>
  );
};

Settings.title = "Settings";
Settings.authenticationEnabled = true;

export default Settings;
