import { useSession } from "next-auth/react";
import React from "react";

import { HeadSeo } from "@quenti/components/head-seo";

import {
  Container,
  Divider,
  HStack,
  Heading,
  Stack,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconSettings } from "@tabler/icons-react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { PageWrapper } from "../common/page-wrapper";
import { AuthedPage } from "../components/authed-page";
import { Loading } from "../components/loading";
import { UnboundOnly } from "../components/unbound-only";
import { WithFooter } from "../components/with-footer";
import { useMe } from "../hooks/use-me";
import { getLayout } from "../layouts/main-layout";
import { AccountInfo } from "../modules/settings/account-info";
import { AccountType } from "../modules/settings/account-type";
import { DangerZone } from "../modules/settings/danger-zone";
import { ProfileInfo } from "../modules/settings/profile-info";
import { Theme } from "../modules/settings/theme";

export const SettingsContext = React.createContext<{
  layout?: "mobile" | "desktop";
}>({});

const Settings = () => {
  return (
    <AuthedPage>
      <HeadSeo title="Settings" />
      <LazyWrapper>
        <SettingsInner />
      </LazyWrapper>
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
            <HStack spacing="3">
              <IconSettings size={32} />
              <Heading size="2xl">Settings</Heading>
            </HStack>
            <Stack spacing={8}>
              <AccountInfo />
              <Divider borderColor={divider} />
              <UnboundOnly strict>
                <AccountType />
                <Divider borderColor={divider} />
              </UnboundOnly>
              <ProfileInfo />
              <Divider borderColor={divider} />
              <Theme />
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
