import React from "react";

import { Link } from "@quenti/components";
import type { User } from "@quenti/prisma/client";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Center,
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
  IconDotsVertical,
  IconExternalLink,
  type TablerIconsProps,
} from "@tabler/icons-react";

import { MenuOptionPure } from "./menu-option";

export interface MemberComponentAction {
  label: string;
  icon: React.FC<TablerIconsProps>;
  destructive?: boolean;
  onClick: (id: string) => void;
}

export interface MemberComponentProps {
  id: string;
  email: string;
  user?: Pick<User, "image" | "name" | "username">;
  isMe?: boolean;
  pending?: boolean;
  skeleton?: boolean;
  additionalTags?: React.ReactNode;
  canManage?: boolean;
  actions?: MemberComponentAction[];
}

export const MemberComponentRaw: React.FC<MemberComponentProps> = ({
  id,
  email,
  user,
  isMe,
  pending,
  skeleton,
  additionalTags,
  canManage = false,
  actions = [],
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

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

  const Tags: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
    return (
      <HStack
        display={{
          base: isMobile ? "inherit" : "none",
          md: isMobile ? "none" : "inherit",
        }}
      >
        {isMe && (
          <Tag size="sm" colorScheme="blue">
            You
          </Tag>
        )}
        {pending && (
          <Tag size="sm" colorScheme="orange">
            Pending
          </Tag>
        )}
        {additionalTags}
      </HStack>
    );
  };

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
            <Avatar src={user?.image || undefined} width="36px" height="36px" />
          </Skeleton>
          <HStack spacing="4">
            <Tags isMobile />
            <Options
              id={id}
              user={user}
              skeleton={skeleton}
              isMe={isMe}
              canManage={canManage}
              actions={actions}
              isMobile
            />
          </HStack>
        </HStack>
        <Stack spacing="2px" maxW="full" minW="0" whiteSpace="nowrap">
          <SmSkeleton>
            <HStack overflow="hidden" whiteSpace="nowrap">
              <Text
                fontWeight={700}
                fontSize="sm"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {user?.name || user?.username || email}
              </Text>
              <Tags />
            </HStack>
          </SmSkeleton>
          <SmSkeleton>
            <Text
              color={mutedColor}
              fontSize="sm"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {pending ? "Invited" : email}
            </Text>
          </SmSkeleton>
        </Stack>
      </HStack>
      <Options
        id={id}
        user={user}
        skeleton={skeleton}
        isMe={isMe}
        canManage={canManage}
        actions={actions}
      />
    </HStack>
  );
};

const Options: React.FC<
  Pick<
    MemberComponentProps,
    "id" | "user" | "skeleton" | "isMe" | "canManage" | "actions"
  > & { isMobile?: boolean }
> = ({
  id,
  user,
  skeleton,
  isMe,
  canManage = false,
  actions = [],
  isMobile = false,
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
            {user && (
              <LinkBox as={Button} px="0">
                <LinkOverlay
                  w="full"
                  h="full"
                  as={Link}
                  href={`/@${user?.username || ""}`}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconExternalLink size="16" />
                </LinkOverlay>
              </LinkBox>
            )}
            {!isMe && canManage && (
              <MenuButton as={IconButton} w="8" h="8">
                <Center w="8" display="flex" justifyContent="center">
                  <IconDotsVertical size="18" />
                </Center>
              </MenuButton>
            )}
          </ButtonGroup>
          {!isMe && canManage && (
            <MenuList
              bg={menuBg}
              py={0}
              overflow="hidden"
              minW="auto"
              w="40"
              shadow="lg"
              display={menuOpen ? "block" : "none"}
            >
              {actions.map((a, i) => (
                <MenuOptionPure
                  key={i}
                  icon={<a.icon size={16} />}
                  label={a.label}
                  fontSize="sm"
                  py="6px"
                  color={a.destructive ? redMenuColor : undefined}
                  onClick={() => a.onClick?.(id)}
                />
              ))}
            </MenuList>
          )}
        </Menu>
      </Box>
    </Skeleton>
  );
};

export const MemberComponent = React.memo(MemberComponentRaw);
