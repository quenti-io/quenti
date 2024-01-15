import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";
import { api } from "@quenti/trpc";

import {
  Box,
  Center,
  Container,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconArrowLeft,
  IconDotsVertical,
  IconPointFilled,
} from "@tabler/icons-react";

import { LazyWrapper } from "../common/lazy-wrapper";
import { ToastWrapper } from "../common/toast-wrapper";
import { AuthedPage } from "../components/authed-page";
import { SkeletonTab } from "../components/skeleton-tab";
import { WithFooter } from "../components/with-footer";
import { useClass } from "../hooks/use-class";
import { useIsClassTeacher } from "../hooks/use-is-class-teacher";
import { BannerPicker } from "../modules/classes/banner-picker";
import { ClassLogo } from "../modules/classes/class-logo";
import { plural } from "../utils/string";
import { MainLayout } from "./main-layout";

const useTabIndex = (): { name: string | null; tabIndex: number } => {
  const router = useRouter();

  switch (router.pathname) {
    case `/classes/[id]`:
      return { name: null, tabIndex: 0 };
    case `/classes/[id]/assignments`:
      return { name: "Assignments", tabIndex: 1 };
    case `/classes/[id]/members`:
      return { name: "Members", tabIndex: 2 };
    case `/classes/[id]/settings/class`:
      return { name: "Settings", tabIndex: 3 };
    case `/classes/[id]/settings/student`:
      return { name: "Settings", tabIndex: 2 };
    default:
      return { name: null, tabIndex: -1 };
  }
};

export interface ClassLayoutProps {
  hideNav?: boolean;
  returnTo?: {
    name: string;
    path: string;
  };
}

export const ClassLayout: React.FC<
  React.PropsWithChildren<ClassLayoutProps>
> = ({ children, hideNav = false, returnTo }) => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useClass({ refetchOnMount: true });
  const utils = api.useUtils();

  const bg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.300", "gray.700");
  const { name, tabIndex } = useTabIndex();

  const preferences = data?.me?.preferences || {};
  const banner = data?.me.preferences?.bannerColor || data?.bannerColor || "";

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [bannerState, setBannerState] = React.useState<string | null>(null);

  const setPreferences = api.classes.setPreferences.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
    },
  });

  const getTitle = () => {
    if (name) return `${name}${data?.name ? ` - ${data.name}` : ""}`;
    if (data?.name) return data.name;
    return "Quenti";
  };

  return (
    <AuthedPage>
      <HeadSeo title={getTitle()} hideTitleSuffix={!name && !data} />
      <MainLayout>
        <LazyWrapper>
          <ToastWrapper>
            <WithFooter>
              <Container maxW="5xl">
                <Stack spacing="0">
                  <Skeleton w="full" h="32" rounded="2xl" isLoaded={!!data}>
                    <Box
                      w="full"
                      h="32"
                      bgGradient={`linear(to-tr, blue.400, ${
                        bannerState || banner
                      })`}
                      rounded="2xl"
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        color="white"
                        top="14px"
                        right="10px"
                      >
                        <BannerPicker
                          isOpen={pickerOpen}
                          onClose={() => setPickerOpen(false)}
                          selected={banner}
                          reset
                          onSelect={(c) => {
                            setPickerOpen(false);
                            setBannerState(c);

                            setPreferences.mutate({
                              classId: id,
                              preferences: {
                                ...preferences,
                                bannerColor: c,
                              },
                            });
                          }}
                          onReset={() => {
                            setPickerOpen(false);
                            setBannerState(data!.bannerColor);

                            setPreferences.mutate({
                              classId: id,
                              preferences: {
                                ...preferences,
                                bannerColor: null,
                              },
                            });
                          }}
                          columns={3}
                        >
                          <Box
                            cursor="pointer"
                            onClick={() => setPickerOpen(true)}
                          >
                            <IconDotsVertical size={18} />
                          </Box>
                        </BannerPicker>
                      </Box>
                    </Box>
                  </Skeleton>
                  <Stack
                    px={{ base: 0, sm: 6, md: 10 }}
                    spacing="8"
                    mt="-36px"
                    zIndex={10}
                  >
                    <Center
                      w="88px"
                      h="88px"
                      rounded="3xl"
                      outlineColor={bg}
                      bg={bg}
                    >
                      <Skeleton
                        w="72px"
                        h="72px"
                        rounded="2xl"
                        isLoaded={!!data}
                      >
                        <Center
                          rounded="2xl"
                          w="72px"
                          h="72px"
                          bg="white"
                          shadow="2xl"
                          overflow="hidden"
                        >
                          <ClassLogo
                            width={72}
                            height={72}
                            url={data?.logoUrl}
                            hash={data?.logoHash}
                          />
                        </Center>
                      </Skeleton>
                    </Center>
                    <Stack spacing="6">
                      {!hideNav && (
                        <Stack spacing="0">
                          <Flex alignItems="center" minH="48px">
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!!data}
                              skeletonHeight="30px"
                            >
                              <Heading>
                                {data?.name || "Placeholder class name"}
                              </Heading>
                            </SkeletonText>
                          </Flex>
                          <Flex alignItems="center" h="21px">
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!!data}
                              skeletonHeight="12px"
                            >
                              <HStack
                                fontSize="sm"
                                color="gray.500"
                                spacing="1"
                              >
                                <Text>
                                  {plural(
                                    data?.studySets?.length || 0,
                                    "study set",
                                  )}
                                </Text>
                                <IconPointFilled size={10} />
                                <Text>
                                  {plural(data?.folders?.length || 0, "folder")}
                                </Text>
                              </HStack>
                            </SkeletonText>
                          </Flex>
                        </Stack>
                      )}
                      {data?.description && !hideNav && (
                        <Text whiteSpace="pre-wrap">{data?.description}</Text>
                      )}
                      {!hideNav ? (
                        <Tabs
                          borderColor={borderColor}
                          isManual
                          index={tabIndex}
                        >
                          <TabList gap="6">
                            <SkeletonTab
                              isLoaded={!!data}
                              href={`/classes/${id}`}
                            >
                              Home
                            </SkeletonTab>
                            <SkeletonTab
                              isLoaded={!!data}
                              href={`/classes/${id}/assignments`}
                            >
                              Assignments
                            </SkeletonTab>
                            <HiddenTabWrapper index={2}>
                              <SkeletonTab
                                isLoaded={!!data}
                                href={`/classes/${id}/members`}
                              >
                                Members
                              </SkeletonTab>
                            </HiddenTabWrapper>
                            {data?.me.type == "Teacher" ? (
                              <HiddenTabWrapper index={3}>
                                <SkeletonTab
                                  isLoaded={!!data}
                                  href={`/classes/${id}/settings/class`}
                                >
                                  Settings
                                </SkeletonTab>
                              </HiddenTabWrapper>
                            ) : (
                              <SkeletonTab
                                isLoaded={!!data}
                                href={`/classes/${id}/settings/student`}
                              >
                                Settings
                              </SkeletonTab>
                            )}
                          </TabList>
                          <TabPanels mt="6">{children}</TabPanels>
                        </Tabs>
                      ) : (
                        <Stack spacing="6">
                          {returnTo && (
                            <Skeleton
                              fitContent
                              rounded="md"
                              isLoaded={!!data}
                              w="max"
                            >
                              <Link href={returnTo.path}>
                                <HStack
                                  color="gray.500"
                                  _hover={{
                                    color: "gray.900",
                                  }}
                                  _dark={{
                                    color: "gray.400",
                                    _hover: {
                                      color: "gray.50",
                                    },
                                  }}
                                  fontWeight={600}
                                  transition="color 150ms ease-in-out"
                                  role="group"
                                >
                                  <Box
                                    transition="transform 150ms ease-in-out"
                                    _groupHover={{
                                      transform: "translateX(-4px)",
                                    }}
                                  >
                                    <IconArrowLeft size={18} />
                                  </Box>
                                  <Text>{returnTo.name}</Text>
                                </HStack>
                              </Link>
                            </Skeleton>
                          )}
                          {children}
                        </Stack>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
              </Container>
            </WithFooter>
          </ToastWrapper>
        </LazyWrapper>
      </MainLayout>
    </AuthedPage>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <ClassLayout>{page}</ClassLayout>
);

interface HiddenTabWrapperProps {
  index: number;
}

const HiddenTabWrapper: React.FC<
  React.PropsWithChildren<HiddenTabWrapperProps>
> = ({ index, children }) => {
  const { tabIndex } = useTabIndex();
  const isTeacher = useIsClassTeacher();
  const { data: class_ } = useClass();

  if (!class_?.me && tabIndex !== index) return null;
  if (!isTeacher) return null;

  return <>{children}</>;
};
