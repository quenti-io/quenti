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
import type { User } from "@quenti/prisma/client";
import {
  IconDotsVertical,
  IconExternalLink,
  type TablerIconsProps,
} from "@tabler/icons-react";
import React from "react";
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
  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const redMenuColor = useColorModeValue("red.600", "red.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const SmSkeleton: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Flex h="20px" alignItems="center">
      <SkeletonText skeletonHeight="12px" noOfLines={1} isLoaded={!skeleton}>
        {children}
      </SkeletonText>
    </Flex>
  );

  const openCallback = React.useCallback(() => {
    setMenuOpen(true);
  }, []);
  const closeCallback = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

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
        roundedTop: "md",
      }}
      _last={{
        roundedBottom: "md",
      }}
      borderColor={borderColor}
      suppressHydrationWarning={true}
      justifyContent="space-between"
    >
      <HStack
        spacing="4"
        w={{ base: "calc(100% - 60px)", md: "inherit" }}
        flexDir={{ base: "column", md: "row" }}
        alignItems={{ base: "start", md: "center" }}
      >
        <HStack
          justifyContent="space-between"
          w={{ base: "full", md: "inherit " }}
        >
          <Skeleton rounded="full" fitContent isLoaded={!skeleton}>
            <Avatar src={user?.image || undefined} width="36px" height="36px" />
          </Skeleton>
        </HStack>
        <Stack spacing="2px" overflow="hidden" maxW="full">
          <SmSkeleton>
            <HStack overflow="hidden" whiteSpace="nowrap">
              <Text fontWeight={700} fontSize="sm">
                {user?.name || email}
              </Text>
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
          </SmSkeleton>
          <SmSkeleton>
            <Text color={mutedColor} fontSize="sm">
              {pending ? "Invited" : email}
            </Text>
          </SmSkeleton>
        </Stack>
      </HStack>
      <Skeleton rounded="md" fitContent isLoaded={!skeleton}>
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
    </HStack>
  );
};

export const MemberComponent = React.memo(MemberComponentRaw);
