import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

import { env } from "@quenti/env/client";
import { avatarUrl } from "@quenti/lib/avatar";
import { outfit } from "@quenti/lib/chakra-theme";
import { APP_URL } from "@quenti/lib/constants/url";
import { useShortcut } from "@quenti/lib/hooks/use-shortcut";
import type { StudySetType, User } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Avatar,
  Box,
  Center,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconBooks,
  IconBuildingSkyscraper,
  IconCloudDownload,
  IconFolder,
  IconFolderPlus,
  IconGhost3,
  IconHome,
  IconLink,
  IconMoon,
  IconPlus,
  IconProgress,
  IconSchool,
  IconSettings,
  IconSun,
  IconUser,
} from "@tabler/icons-react";

import { menuEventChannel } from "../events/menu";
import { useDevActions } from "../hooks/use-dev-actions";
import { useIsTeacher } from "../hooks/use-is-teacher";
import { useMe } from "../hooks/use-me";
import { plural } from "../utils/string";

export interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type EntityType = "set" | "folder";

interface Entity {
  id: string;
  name: string;
  entityType: EntityType;
  author: Pick<User, "username" | "image">;
  type?: StudySetType;
  collaborators?: string[];
  viewedAt: Date;
}

export interface MenuOption {
  icon: React.ReactNode;
  name: string;
  searchableName?: string;
  label?: string;
  action: (ctrl: boolean) => void | Promise<void>;
  sortableDate?: Date;
  entity?: Entity;
  shouldShow?: () => boolean;
  loadable?: boolean;
  isLoading?: boolean;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const session = useSession();
  const { data: me } = useMe();
  const devActions = useDevActions();
  const isTeacher = useIsTeacher();
  const { colorMode, toggleColorMode } = useColorMode();

  const dismiss = router.pathname == "/onboarding/command-menu";
  const onSet = router.pathname == "/sets/[id]";
  const onFolder = router.pathname == "/profile/[username]/folders/[slug]";

  const url = (id: string) => `${APP_URL}/_${id}`;
  const onSuccess = (id: string) => {
    void (async () => {
      await navigator.clipboard.writeText(url(id));
    })();
    onClose();
  };

  const getSetShareId = api.studySets.getShareId.useQuery(
    { studySetId: router.query.id as string },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess,
    },
  );

  const getFolderShareId = api.folders.getShareId.useQuery(
    {
      idOrSlug: router.query.slug as string,
      username: ((router.query.username as string) || "").slice(1),
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      onSuccess,
    },
  );

  const [options, setOptions] = React.useState<MenuOption[]>([]);

  const recentQuery = api.recent.get.useQuery(undefined, {
    enabled: isOpen,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      let total: MenuOption[] = [];

      for (const set of data.sets) {
        total.push({
          icon: <IconBooks />,
          name: set.title,
          searchableName: set.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          action: (ctrl) => openLink(`/${set.id}`, ctrl),
          sortableDate: set.viewedAt,
          entity: {
            id: set.id,
            name: set.title,
            entityType: "set",
            type: set.type,
            author: set.user,
            viewedAt: set.viewedAt,
            collaborators: set.collaborators?.avatars,
          },
          shouldShow: () => !window.location.pathname.startsWith(`/${set.id}`),
        });
      }
      for (const folder of data.folders) {
        const url = `/@${folder.user.username}/folders/${
          folder.slug ?? folder.id
        }`;

        total.push({
          icon: <IconFolder />,
          name: folder.title,
          searchableName: folder.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          action: (ctrl) => openLink(url, ctrl),
          sortableDate: folder.viewedAt,
          entity: {
            id: folder.id,
            name: folder.title,
            entityType: "folder",
            author: folder.user,
            viewedAt: folder.viewedAt,
          },
          shouldShow: () => !window.location.pathname.startsWith(url),
        });
      }
      for (const draft of data.drafts) {
        total.push({
          icon: <IconProgress />,
          name: draft.title,
          searchableName: draft.title
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          action: (ctrl) => openLink(`/${draft.id}/create`, ctrl),
          sortableDate: draft.savedAt,
          entity: {
            id: draft.id,
            name: draft.title,
            entityType: "set",
            author: draft.user,
            viewedAt: draft.savedAt,
          },
          shouldShow: () => {
            const path = window.location.pathname;
            if (path == `/${draft.id}/create`) return false;
            if (path == "/create") {
              const latest = data.drafts.sort(
                (a, b) =>
                  new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
              )[0];
              if (latest?.id == draft.id) return false;
            }

            return true;
          },
        });
      }
      for (const class_ of data.classes) {
        const url = `/classes/${class_.id}`;

        total.push({
          icon: <IconSchool />,
          name: class_.name,
          label:
            class_._count.members !== undefined
              ? `${plural(class_._count.members || 0, "student")} · ${plural(
                  class_._count.sections || 0,
                  "section",
                )}`
              : `${plural(class_._count.studySets || 0, "set")} · ${plural(
                  class_._count.folders || 0,
                  "folder",
                )}`,
          sortableDate: class_.viewedAt || undefined,
          searchableName: class_.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
          action: (ctrl) => openLink(url, ctrl),
          shouldShow: () => !window.location.pathname.startsWith(url),
        });
      }

      total = total.sort(
        (a, b) =>
          (b.sortableDate?.getTime() || 0) - (a.sortableDate?.getTime() || 0),
      );

      if (onSet || onFolder) {
        total.push({
          icon: <IconLink />,
          name: "Copy Link",
          label: `Copy the URL for this ${onSet ? "set" : "folder"}`,
          action: async () => {
            if (onSet) await getSetShareId.refetch();
            if (onFolder) await getFolderShareId.refetch();
          },
          loadable: true,
        });
      }

      total.push({
        icon: <IconHome />,
        name: "Home",
        label: "Navigate home",
        action: (ctrl) => openLink(`/home`, ctrl),
        shouldShow: () => window.location.pathname !== "/home",
      });
      if (me && me.orgMembership) {
        total.push({
          icon: <IconBuildingSkyscraper />,
          name: me.orgMembership.organization.name,
          label: "Navigate to your organization",
          action: (ctrl) => openLink(`/orgs`, ctrl),
          shouldShow: () => window.location.pathname !== "/orgs",
        });
      }

      total.push({
        icon: <IconUser />,
        name: "Profile",
        label: "Navigate to your profile",
        action: (ctrl) =>
          openLink(`/@${session.data?.user?.username || ""}`, ctrl),
        shouldShow: () =>
          window.location.pathname !==
          `/@${session.data?.user?.username || ""}`,
      });
      total.push({
        icon: <IconSettings />,
        name: "Settings",
        label: "Navigate to settings",
        action: (ctrl) => openLink(`/settings`, ctrl),
        shouldShow: () => window.location.pathname !== "/settings",
      });

      total.push({
        icon: <IconPlus />,
        name: "Create Study Set",
        label: "Create a new study set",
        action: (ctrl) => openLink(`/create`, ctrl),
        shouldShow: () => window.location.pathname !== "/create",
      });
      total.push({
        icon: <IconCloudDownload />,
        name: "Import From Quizlet",
        label: "Import a study set from Quizlet.com",
        action: () => menuEventChannel.emit("openImportDialog"),
      });
      total.push({
        icon: <IconFolderPlus />,
        name: "Create Folder",
        label: "Create a new folder",
        action: () => menuEventChannel.emit("createFolder"),
      });
      if (isTeacher) {
        total.push({
          icon: <IconPlus />,
          name: "Create Class",
          label: "Create a new class",
          action: () => menuEventChannel.emit("createClass"),
        });
      }

      total.push({
        icon: colorMode == "dark" ? <IconSun /> : <IconMoon />,
        name: "Toggle Theme",
        label: `Switch to ${colorMode == "dark" ? "light" : "dark"} mode`,
        action: toggleColorMode,
      });

      if (env.NEXT_PUBLIC_DEPLOYMENT === undefined) total.push(...devActions);

      setOptions(total);
    },
  });

  const [query, setQuery] = React.useState("");
  const [selectionIndex, setSelectionIndex] = React.useState(0);
  const [ignoreMouse, setIgnoreMouse] = React.useState(false);

  const filteredOptions: MenuOption[] = options
    .filter((o) => (!!o.shouldShow ? o.shouldShow() : true))
    .filter((e) =>
      (e.searchableName ?? e.name).toLowerCase().includes(query.toLowerCase()),
    );

  const openLink = (link: string, ctrl: boolean) => {
    void (async () => {
      if (ctrl) {
        window.open(link, "_blank");
      } else {
        await router.push(link);
      }
    })();
  };

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const resultsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    resultsRef.current = resultsRef.current.slice(0, filteredOptions?.length);
  }, [filteredOptions]);

  React.useEffect(() => {
    setSelectionIndex(0);
  }, [filteredOptions?.length]);

  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
    setSelectionIndex(0);
  }, [isOpen]);

  const onSubmit = (i: number, ctrl: boolean) => {
    const option = filteredOptions[i]!;

    if (!dismiss || option.name == "Toggle Theme") {
      void (async () => {
        await option.action(ctrl);
      })();
    }

    if (option.loadable) {
      option.isLoading = true;
      setOptions([...options]);
      return;
    }
    onClose();
  };

  const borderColor = useColorModeValue("gray.200", "gray.750");
  const cursorBg = useColorModeValue(
    "rgba(226, 232, 240, 50%)",
    "rgba(45, 55, 72, 50%)",
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay
        backdropFilter="blur(12px)"
        transform="translateZ(0px)"
        backgroundColor={useColorModeValue(
          "rgba(247, 250, 252, 75%)",
          "rgba(23, 25, 35, 40%)",
        )}
      />
      <ModalContent
        background={useColorModeValue(
          "rgba(247, 250, 252, 40%)",
          "rgba(23, 25, 35, 60%)",
        )}
        backdropFilter="blur(12px)"
        borderWidth="2px"
        rounded="xl"
        borderColor={borderColor}
        shadow="xl"
      >
        <ModalBody p="0">
          {isOpen && (
            <ShortcutsManager
              filteredOptions={filteredOptions}
              selectionIndex={selectionIndex}
              setSelectionIndex={setSelectionIndex}
              setIgnoreMouse={setIgnoreMouse}
              resultsRef={resultsRef}
              scrollRef={scrollRef}
              onSubmit={(ctrl) => onSubmit(selectionIndex, ctrl)}
            />
          )}
          <Box
            py="5"
            px="7"
            borderBottomWidth="2px"
            borderBottomColor={borderColor}
          >
            <Input
              placeholder="Where would you like to go?"
              size="lg"
              variant="unstyled"
              fontSize="2xl"
              px="0"
              _placeholder={{
                color: "gray.500",
              }}
              color={useColorModeValue("gray.900", "whiteAlpha.900")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>
          <Box
            overflow={filteredOptions.length > 6 ? "auto" : "hidden"}
            px="4"
            my="4"
            pos="relative"
            transition="height cubic-bezier(.4,0,.2,1) 300ms"
            style={{
              height:
                recentQuery.isLoading && !filteredOptions.length
                  ? 64
                  : 72 * (filteredOptions || []).slice(0, 6).length,
            }}
            ref={scrollRef}
          >
            {!!filteredOptions.length && (
              <Box
                pos="absolute"
                h="72px"
                w="full"
                top="0"
                left="0"
                px="4"
                transition="transform cubic-bezier(.4,0,.2,1) 200ms"
                style={{
                  transform: `translateY(${selectionIndex * 72}px)`,
                }}
              >
                <Box bg={cursorBg} rounded="xl" w="full" h="full" />
              </Box>
            )}
            {recentQuery.isLoading && !filteredOptions.length && (
              <Center w="full" h="16">
                <Spinner color="blue.300" />
              </Center>
            )}
            {filteredOptions.map((o, i) => (
              <OptionComp
                key={i}
                index={i}
                icon={o.icon}
                name={o.name}
                label={o.label}
                type={o.entity?.type}
                author={o.entity?.author}
                collaborators={o.entity?.collaborators}
                resultsRef={resultsRef}
                selectionIndex={selectionIndex}
                setSelectionIndex={setSelectionIndex}
                isLoading={o.isLoading}
                ignoreMouse={ignoreMouse}
                setIgnoreMouse={setIgnoreMouse}
                onClick={(e) => onSubmit(i, e.ctrlKey)}
              />
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface OptionCompProps {
  index: number;
  icon: React.ReactNode;
  name: string;
  type?: StudySetType;
  author?: Pick<User, "username" | "image">;
  collaborators?: string[];
  label?: string;
  resultsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  selectionIndex: number;
  setSelectionIndex: React.Dispatch<React.SetStateAction<number>>;
  isLoading?: boolean;
  ignoreMouse: boolean;
  setIgnoreMouse: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const OptionComp: React.FC<OptionCompProps> = ({
  index,
  icon,
  name,
  type,
  author,
  collaborators,
  label,
  resultsRef,
  selectionIndex,
  setSelectionIndex,
  ignoreMouse,
  isLoading,
  setIgnoreMouse,
  onClick,
}) => {
  const baseText = useColorModeValue("gray.600", "whiteAlpha.700");
  const highlightText = useColorModeValue("gray.900", "whiteAlpha.900");
  const baseColor = useColorModeValue("gray.500", "gray.400");
  const highlightColor = useColorModeValue("gray.900", "gray.50");

  return (
    <Flex
      alignItems="center"
      p="4"
      ref={(el) => (resultsRef.current[index] = el)}
      gap="4"
      h="72px"
      pos="relative"
      cursor="pointer"
      w="full"
      onPointerEnter={() => {
        if (!ignoreMouse) setSelectionIndex(index);
      }}
      onPointerMove={() => {
        setIgnoreMouse(false);
        setSelectionIndex(index);
      }}
      onClick={onClick}
    >
      <Box
        transition="all cubic-bezier(.4,0,.2,1) 300ms"
        color={selectionIndex == index ? highlightColor : baseColor}
        transform={
          selectionIndex == index
            ? "rotate(-10deg) scale(1.1)"
            : "rotate(0deg) scale(1)"
        }
      >
        {!isLoading ? (
          icon
        ) : (
          <Center boxSize="6">
            <Spinner boxSize="4" />
          </Center>
        )}
      </Box>
      <Stack spacing={1} w="full" overflow="hidden">
        <Text
          fontSize="lg"
          fontWeight={600}
          fontFamily={outfit.style.fontFamily}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          transition="color cubic-bezier(.4,0,.2,1) 300ms"
          color={selectionIndex === index ? highlightText : baseText}
        >
          {name}
        </Text>
        {author && type == "Default" ? (
          <HStack>
            <Avatar
              src={avatarUrl(author)}
              size="2xs"
              className="highlight-block"
            />
            <Text fontSize="xs" color={baseText} className="highlight-block">
              {author.username}
            </Text>
          </HStack>
        ) : type == "Collab" ? (
          !!collaborators?.length ? (
            <HStack spacing="0">
              <svg
                width="0"
                height="0"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <mask id="avatarClip">
                    <circle cx="8" cy="8" r="8" fill="white" />
                    <circle cx="22" cy="8" r="10" fill="black" />
                  </mask>
                  <mask id="defaultAvatar">
                    <circle cx="8" cy="8" r="8" fill="white" />
                  </mask>
                </defs>
              </svg>
              {collaborators.map((c, i) => (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <Avatar
                  key={i}
                  src={c}
                  width="16px"
                  height="16px"
                  bg="gray.300"
                  _dark={{
                    bg: "gray.600",
                  }}
                  icon={<></>}
                  style={{
                    borderRadius: 0,
                    width: "16px",
                    height: "16px",
                    marginLeft: i != 0 ? "-2px" : 0,
                    mask:
                      i < collaborators.length - 1
                        ? "url(#avatarClip)"
                        : "url(#defaultAvatar)",
                  }}
                />
              ))}
            </HStack>
          ) : (
            <HStack spacing="1" color={baseText}>
              <IconGhost3 size={16} />
              <Text fontSize="xs">No collaborators yet</Text>
            </HStack>
          )
        ) : (
          ""
        )}
        {label && (
          <Text fontSize="xs" color={baseText}>
            {label}
          </Text>
        )}
      </Stack>
    </Flex>
  );
};

interface ShortcutsManagerProps {
  filteredOptions: MenuOption[];
  selectionIndex: number;
  setSelectionIndex: React.Dispatch<React.SetStateAction<number>>;
  setIgnoreMouse: React.Dispatch<React.SetStateAction<boolean>>;
  resultsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  onSubmit: (ctrl: boolean) => void;
}

const ShortcutsManager: React.FC<ShortcutsManagerProps> = ({
  filteredOptions: filteredEvents,
  selectionIndex,
  setSelectionIndex,
  setIgnoreMouse,
  resultsRef,
  scrollRef,
  onSubmit,
}) => {
  const isScrolledIntoView = (el: HTMLDivElement) => {
    const container = scrollRef.current!;

    const rect = el.getBoundingClientRect();
    const { bottom, top } = rect;
    let { height } = rect;

    const containerRect = container.getBoundingClientRect();
    height = height - 72;

    const visible =
      top <= containerRect.top
        ? containerRect.top - top <= height
        : bottom - containerRect.bottom <= height;

    return visible;
  };

  useShortcut(
    ["ArrowDown", "Tab"],
    () => {
      if (!filteredEvents.length) return;

      setIgnoreMouse(true);
      setSelectionIndex((i) => {
        const next = i < filteredEvents.length - 1 ? i + 1 : 0;
        const scrollTo = next;
        if (!isScrolledIntoView(resultsRef.current[scrollTo]!))
          resultsRef.current[scrollTo]!.scrollIntoView(false);

        return next;
      });
    },
    {
      ctrlKey: false,
      shiftKey: false,
    },
  );

  const up = () => {
    if (!filteredEvents.length) return;

    setIgnoreMouse(true);
    setSelectionIndex((i) => {
      const next = i > 0 ? i - 1 : filteredEvents.length - 1;
      const scrollTo =
        next == filteredEvents.length - 1
          ? next
          : Math.max(selectionIndex - 1, 0);

      if (!isScrolledIntoView(resultsRef.current[scrollTo]!))
        resultsRef.current[scrollTo]!.scrollIntoView();

      return next;
    });
  };

  useShortcut(["ArrowUp"], up, {
    ctrlKey: false,
  });
  useShortcut(["Tab"], up, {
    ctrlKey: false,
    shiftKey: "Tab",
  });

  useShortcut(
    ["Enter"],
    () => {
      if (!!filteredEvents.length) onSubmit(false);
    },
    {
      ctrlKey: false,
    },
  );
  useShortcut(
    ["Enter"],
    () => {
      if (!!filteredEvents.length) onSubmit(true);
    },
    {
      ctrlKey: true,
    },
  );

  return <></>;
};
