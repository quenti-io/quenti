import React from "react";

import { Link } from "@quenti/components";
import { avatarUrl } from "@quenti/lib/avatar";
import type { User } from "@quenti/prisma/client";

import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  SkeletonText,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconDotsVertical,
  IconExternalLink,
  IconUserX,
} from "@tabler/icons-react";

import { MenuOptionPure } from "../../components/menu-option";

interface OrganizationUserProps {
  user: Pick<User, "id" | "name" | "username" | "email" | "image">;
  skeleton?: boolean;
  canManage?: boolean;
  tags?: React.ReactNode;
  onRequestRemove?: (id: string) => void;
}

const OrganizationUserRaw: React.FC<OrganizationUserProps> = ({
  user,
  skeleton = false,
  canManage = false,
  tags,
  onRequestRemove,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const buttonGroupBg = useColorModeValue("gray.50", "gray.800");
  const menuBg = useColorModeValue("white", "gray.800");
  const redMenuColor = useColorModeValue("red.600", "red.200");

  const callback = React.useCallback(() => {
    onRequestRemove?.(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCallback = React.useCallback(() => {
    setMenuOpen(true);
  }, []);
  const closeCallback = React.useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <Tr>
      <Td pl="0">
        <Skeleton
          isLoaded={!skeleton}
          fitContent
          rounded="full"
          h="32px"
          w="32px"
        >
          <Avatar
            size="sm"
            src={!skeleton ? avatarUrl({ ...user, image: user.image! }) : ""}
          />
        </Skeleton>
      </Td>
      <Td w="full">
        <Flex alignItems="center" h="6" flex="1">
          <SkeletonText
            isLoaded={!skeleton}
            fitContent
            noOfLines={1}
            w="max-content"
            skeletonHeight="5"
          >
            <HStack>
              <Text fontWeight={600}>{user.name}</Text>
              {tags}
            </HStack>
          </SkeletonText>
        </Flex>
      </Td>
      <Td w="full">
        <Flex alignItems="center" h="21px">
          <SkeletonText
            isLoaded={!skeleton}
            noOfLines={1}
            fitContent
            skeletonHeight="3"
          >
            <Text fontSize="sm" color="gray.500">
              {user.email}
            </Text>
          </SkeletonText>
        </Flex>
      </Td>
      <Td pr="0" textAlign="right">
        <ButtonGroup
          size="sm"
          alignItems="center"
          isAttached
          variant="outline"
          colorScheme="gray"
          bg={buttonGroupBg}
          rounded="md"
        >
          <Skeleton rounded="md" isLoaded={!skeleton} fitContent>
            <IconButton
              aria-label="View public profile"
              icon={<IconExternalLink size={18} />}
              as={Link}
              variant="outline"
              colorScheme="gray"
              size="sm"
              roundedRight={canManage ? "none" : "md"}
              href={`/@${user.username}`}
            />
          </Skeleton>
          {canManage && (
            <Box position="relative">
              <Menu
                placement="bottom-end"
                isOpen={menuOpen}
                onOpen={openCallback}
                onClose={closeCallback}
                isLazy
              >
                <MenuButton roundedLeft="none" as={IconButton} w="8" h="8">
                  <Box w="8" display="flex" justifyContent="center">
                    <IconDotsVertical size="18" />
                  </Box>
                </MenuButton>
                <MenuList
                  bg={menuBg}
                  py={0}
                  overflow="hidden"
                  minW="auto"
                  w="32"
                  shadow="lg"
                  display={menuOpen ? "block" : "none"}
                >
                  <MenuOptionPure
                    icon={<IconUserX size={16} />}
                    label="Remove"
                    fontSize="sm"
                    py="6px"
                    color={redMenuColor}
                    onClick={callback}
                  />
                </MenuList>
              </Menu>
            </Box>
          )}
        </ButtonGroup>
      </Td>
    </Tr>
  );
};

export const OrganizationUser = React.memo(OrganizationUserRaw);
