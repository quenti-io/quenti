import {
  Avatar,
  Box,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "@prisma/client";
import { IconBooks } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { api } from "../utils/api";
import { avatarUrl } from "../utils/avatar";

export interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

type EntityType = "set" | "folder";

interface Entity {
  id: string;
  name: string;
  type: EntityType;
  author: Pick<User, "username" | "image">;
}

interface MenuOption {
  icon: React.ReactNode;
  name: string;
  action: (ctrl: boolean) => void;
  entity?: Entity;
  shouldShow?: () => boolean;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const [options, setOptions] = React.useState<MenuOption[]>([]);

  const { data } = api.studySets.recent.useQuery(
    {},
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        let total: MenuOption[] = [];

        for (const set of data) {
          total.push({
            icon: <IconBooks />,
            name: set.title,
            action: (ctrl) => openLink(`/${set.id}`, ctrl),
            entity: {
              id: set.id,
              name: set.title,
              type: "set",
              author: set.user,
            },
            shouldShow: () => !router.pathname.startsWith(`/${set.id}`),
          });
        }

        setOptions(total);
      },
    }
  );

  const [query, setQuery] = React.useState("");
  const [selectionIndex, setSelectionIndex] = React.useState(0);
  const [ignoreMouse, setIgnoreMouse] = React.useState(false);

  const filteredOptions: MenuOption[] = options
    .filter((o) => (o.shouldShow ? o.shouldShow() : true))
    .filter((e) => (e.name || "").toLowerCase().includes(query.toLowerCase()));

  const openLink = (link: string, ctrl: boolean) => {
    if (ctrl) {
      window.open(link, "_blank");
    } else {
      router.push(link);
    }
  };

  const onSubmit = (i: number, ctrl: boolean) => {
    const option = filteredOptions[i]!;
    option.action(ctrl);
    onClose();
  };

  const borderColor = useColorModeValue("gray.200", "gray.750");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay
        backdropFilter="blur(12px)"
        backgroundColor={useColorModeValue(
          "rgba(247, 250, 252, 75%)",
          "rgba(23, 25, 35, 40%)"
        )}
      />
      <ModalContent
        background={useColorModeValue(
          "rgba(247, 250, 252, 40%)",
          "rgba(23, 25, 35, 60%)"
        )}
        backdropFilter="blur(12px)"
        borderWidth="2px"
        rounded="xl"
        borderColor={borderColor}
        shadow="xl"
      >
        <ModalBody p="0">
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
            overflow="auto"
            mt="4"
            px="4"
            pos="relative"
            transition="height cubic-bezier(.4,0,.2,1) 300ms"
            pb="4"
            style={{
              height: 72 * (filteredOptions || []).slice(0, 6).length + 16,
            }}
          >
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
              <Box
                bg={useColorModeValue(
                  "rgba(226, 232, 240, 50%)",
                  "rgba(45, 55, 72, 50%)"
                )}
                rounded="xl"
                w="full"
                h="full"
              />
            </Box>
            {filteredOptions.map((o, i) => (
              <OptionComp
                key={i}
                index={i}
                icon={o.icon}
                name={o.name}
                author={o.entity?.author}
                selectionIndex={selectionIndex}
                setSelectionIndex={setSelectionIndex}
                ignoreMouse={ignoreMouse}
                setIgnoreMouse={setIgnoreMouse}
                onAction={() => onSubmit(i, false)}
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
  author?: Pick<User, "username" | "image">;
  selectionIndex: number;
  setSelectionIndex: React.Dispatch<React.SetStateAction<number>>;
  ignoreMouse: boolean;
  setIgnoreMouse: React.Dispatch<React.SetStateAction<boolean>>;
  onAction: () => void;
}

const OptionComp: React.FC<OptionCompProps> = ({
  index,
  icon,
  name,
  author,
  selectionIndex,
  setSelectionIndex,
  ignoreMouse,
  setIgnoreMouse,
  onAction,
}) => {
  const baseText = useColorModeValue("gray.600", "whiteAlpha.700");
  const highlightText = useColorModeValue("gray.900", "whiteAlpha.900");
  const baseColor = useColorModeValue("gray.500", "gray.400");
  const highlightColor = useColorModeValue("gray.900", "gray.50");

  return (
    <Flex
      alignItems="center"
      p="4"
      gap="4"
      h="72px"
      pos="relative"
      w="full"
      onPointerEnter={() => {
        if (!ignoreMouse) setSelectionIndex(index);
      }}
      onPointerMove={() => {
        setIgnoreMouse(false);
        setSelectionIndex(index);
      }}
    >
      <Box
        transition="color cubic-bezier(.4,0,.2,1) 300ms"
        color={selectionIndex == index ? highlightColor : baseColor}
      >
        {icon}
      </Box>
      <Stack spacing={1} w="full" overflow="hidden">
        <Text
          fontSize="lg"
          fontWeight={600}
          fontFamily="Outfit"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
          transition="color cubic-bezier(.4,0,.2,1) 300ms"
          color={selectionIndex === index ? highlightText : baseText}
        >
          {name}
        </Text>
        {author && (
          <HStack>
            <Avatar src={avatarUrl(author)} size="2xs" />
            <Text fontSize="xs" color={baseText}>
              {author.username}
            </Text>
          </HStack>
        )}
      </Stack>
    </Flex>
  );
};
