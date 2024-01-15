import React from "react";

import { Link } from "@quenti/components";
import type { User } from "@quenti/prisma/client";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconAlertCircle,
  IconBan,
  IconDotsVertical,
  IconExternalLink,
  IconSwitchHorizontal,
  IconUserX,
} from "@tabler/icons-react";

import { MenuOptionPure } from "../../components/menu-option";

export interface ClassStudentProps {
  user: Pick<User, "id" | "name" | "username" | "image" | "email">;
  section?: { id: string; name: string };
  skeleton?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onRequestChangeSection?: (id: string) => void;
  onRequestRemove?: (id: string) => void;
  onRequestBan?: (id: string) => void;
}

export const ClassStudentRaw: React.FC<ClassStudentProps> = ({
  user,
  section,
  skeleton = false,
  selected = false,
  onSelect,
  onRequestChangeSection,
  onRequestRemove,
  onRequestBan,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const pillBg = useColorModeValue("gray.100", "gray.700");

  const SmSkeleton: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Flex h="20px" alignItems="center" overflow="hidden">
      <SkeletonText
        skeletonHeight="12px"
        noOfLines={1}
        isLoaded={!skeleton}
        minW="0"
      >
        {children}
      </SkeletonText>
    </Flex>
  );

  const SectionTag: React.FC<{ isMobile?: boolean }> = ({
    isMobile = false,
  }) => (
    <Skeleton
      rounded="full"
      fitContent
      isLoaded={!skeleton}
      display={{
        base: isMobile ? "inherit" : "none",
        md: isMobile ? "none" : "inherit",
      }}
    >
      {section ? (
        <Tag fontSize="xs" background={pillBg} variant="subtle" rounded="full">
          {section.name}
        </Tag>
      ) : (
        <HStack color="gray.500">
          <Box color="red.300">
            <IconAlertCircle size={16} />
          </Box>
          <Text fontSize="xs" fontWeight={600}>
            Unassigned
          </Text>
        </HStack>
      )}
    </Skeleton>
  );

  return (
    <HStack
      py="14px"
      my="-1px"
      px="18px"
      transition="background 0.2s ease-in-out"
      borderY="solid 1px"
      _hover={{
        background: hoverColor,
      }}
      _first={{
        roundedTop: "8px",
      }}
      _last={{
        roundedBottom: "8px",
      }}
      borderColor={borderColor}
      justifyContent="space-between"
      maxW="full"
      spacing={{ base: 0, md: 2 }}
    >
      <HStack spacing="4" w={{ base: "full", md: "inherit" }} maxW="full" m="0">
        <Skeleton fitContent h="4" rounded="md" isLoaded={!skeleton}>
          <Checkbox
            isChecked={selected}
            onChange={(e) => onSelect?.(user.id, e.target.checked)}
          />
        </Skeleton>
        <HStack
          spacing="4"
          flexDir={{ base: "column", md: "row" }}
          alignItems={{ base: "start", md: "inherit" }}
          minW="0"
          w={{ base: "full", md: "inherit" }}
        >
          <HStack
            spacing={{ base: 4, md: 0 }}
            justifyContent={{
              base: "space-between",
              md: "inherit",
            }}
            w={{ base: "full", md: "inherit" }}
          >
            <Skeleton rounded="full" fitContent isLoaded={!skeleton}>
              <Avatar
                src={user.image || undefined}
                width="36px"
                height="36px"
              />
            </Skeleton>
            <HStack spacing="4">
              <SectionTag isMobile />
              <Options
                user={user}
                skeleton={skeleton}
                onRequestBan={onRequestBan}
                onRequestChangeSection={onRequestChangeSection}
                onRequestRemove={onRequestRemove}
                isMobile
              />
            </HStack>
          </HStack>
          <Stack spacing="2px" maxW="full" minW="0" whiteSpace="nowrap">
            <SmSkeleton>
              <Text
                fontWeight={700}
                fontSize="sm"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {user.name || user.username}
              </Text>
            </SmSkeleton>
            <SmSkeleton>
              <Text
                color={mutedColor}
                fontSize="sm"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {user.email}
              </Text>
            </SmSkeleton>
          </Stack>
        </HStack>
      </HStack>
      <HStack spacing="6">
        <SectionTag />
        <Options
          user={user}
          skeleton={skeleton}
          onRequestBan={onRequestBan}
          onRequestChangeSection={onRequestChangeSection}
          onRequestRemove={onRequestRemove}
        />
      </HStack>
    </HStack>
  );
};

const Options: React.FC<
  Pick<
    ClassStudentProps,
    | "user"
    | "skeleton"
    | "onRequestChangeSection"
    | "onRequestRemove"
    | "onRequestBan"
  > & { isMobile?: boolean }
> = ({
  user,
  skeleton,
  onRequestBan,
  onRequestChangeSection,
  onRequestRemove,
  isMobile,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuBg = useColorModeValue("white", "gray.800");
  const redMenuColor = useColorModeValue("red.600", "red.200");

  const openCallback = React.useCallback(() => {
    setMenuOpen(true);
  }, []);
  const closeCallback = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <Skeleton
      rounded="md"
      fitContent
      isLoaded={!skeleton}
      display={{
        base: isMobile ? "inherit" : "none",
        md: isMobile ? "none" : "inherit",
      }}
    >
      <Box position="relative">
        <Menu
          placement="bottom-end"
          isOpen={menuOpen}
          onOpen={openCallback}
          onClose={closeCallback}
          isLazy
        >
          <ButtonGroup
            size="sm"
            colorScheme="gray"
            variant="outline"
            isAttached
          >
            <LinkBox as={Button} px="0">
              <LinkOverlay
                w="full"
                h="full"
                href={`/@${user?.username || ""}`}
                as={Link}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <IconExternalLink size="16" />
              </LinkOverlay>
            </LinkBox>
            <MenuButton as={IconButton} w="8" h="8">
              <Center w="8" display="flex" justifyContent="center">
                <IconDotsVertical size="18" />
              </Center>
            </MenuButton>
          </ButtonGroup>
          <MenuList
            bg={menuBg}
            py={0}
            overflow="hidden"
            minW="auto"
            w="40"
            shadow="lg"
            display={menuOpen ? "block" : "none"}
          >
            <MenuOptionPure
              icon={<IconSwitchHorizontal size={16} />}
              label="Change section"
              fontSize="sm"
              py="6px"
              onClick={() => onRequestChangeSection?.(user.id)}
            />
            <MenuOptionPure
              icon={<IconUserX size={16} />}
              label="Remove"
              fontSize="sm"
              py="6px"
              onClick={() => onRequestRemove?.(user.id)}
            />
            <MenuOptionPure
              icon={<IconBan size={16} />}
              label="Ban"
              fontSize="sm"
              py="6px"
              color={redMenuColor}
              onClick={() => onRequestBan?.(user.id)}
            />
          </MenuList>
        </Menu>
      </Box>
    </Skeleton>
  );
};

export const ClassStudent = React.memo(ClassStudentRaw);
