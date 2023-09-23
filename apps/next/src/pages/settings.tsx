import { useSession } from "next-auth/react";
import React from "react";

import { HeadSeo } from "@quenti/components";

import {
  Container,
  Divider,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { Loading } from "../components/loading";
import { UnboundOnly } from "../components/unbound-only";
import { WithFooter } from "../components/with-footer";
import { useMe } from "../hooks/use-me";
import { getLayout } from "../layouts/main-layout";
import { AccountType } from "../modules/settings/account-type";
import { AppPreferences } from "../modules/settings/app-preferences";
import { DangerZone } from "../modules/settings/danger-zone";
import { GAccountInfo } from "../modules/settings/g-account-info";
import { ProfileInfo } from "../modules/settings/profile-info";

export const SettingsContext = React.createContext<{
  layout?: "mobile" | "desktop";
}>({});

const Settings = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Settings" />
      <SettingsInner />
    </AuthedPage>
  );
};

const SettingsInner = () => {
  const { data: session } = useSession();
  const { data: me } = useMe();

  const layout: "mobile" | "desktop" | undefined = useBreakpointValue({
    base: "mobile",
    md: "desktop",
  });

  const divider = useColorModeValue("gray.400", "gray.600");

  if (!layout || !session || !me) return <Loading />;

  return (
    <WithFooter>
      <SettingsContext.Provider value={{ layout }}>
        <Container maxW="4xl">
          <Stack spacing={12}>
            <Heading size="2xl">Settings</Heading>
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
              <DangerZone />
            </Stack>
          </Stack>
        </Container>
      </SettingsContext.Provider>
    </WithFooter>
  );
};

Settings.PageWrapper = PageWrapper;
Settings.getLayout = getLayout;

export default Settings;
