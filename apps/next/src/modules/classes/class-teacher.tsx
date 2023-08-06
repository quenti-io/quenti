import {
  Avatar,
  Box,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  IconButton,
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
  IconUserX,
} from "@tabler/icons-react";
import React from "react";
import { MenuOptionPure } from "../../components/menu-option";

export interface ClassTeacherProps {
  id: string;
  email: string;
  user?: Pick<User, "image" | "name" | "username">;
  isMe?: boolean;
  pending?: boolean;
  skeleton?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onRequestRemove?: (id: string) => void;
}

export const ClassTeacherRaw: React.FC<ClassTeacherProps> = ({
  id,
  email,
  user,
  isMe,
  pending,
  skeleton,
  selected,
  onSelect,
  onRequestRemove,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const SmSkeleton: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Flex h="20px" alignItems="center">
      <SkeletonText skeletonHeight="12px" noOfLines={1} isLoaded={!skeleton}>
        {children}
      </SkeletonText>
    </Flex>
  );

  const menuBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const redMenuColor = useColorModeValue("red.600", "red.200");
  const pillBg = useColorModeValue("gray.100", "gray.700");

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
      <HStack spacing="4">
        <Skeleton rounded="full" fitContent isLoaded={!skeleton}>
          <Avatar src={user?.image || undefined} width="36px" height="36px" />
        </Skeleton>
        <Stack spacing="2px">
          <SmSkeleton>
            <HStack>
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
              <IconButton
                aria-label="Go to profile"
                icon={<IconExternalLink size={16} />}
              />
              {!isMe && (
                <MenuButton as={IconButton} w="8" h="8">
                  <Center w="8" display="flex" justifyContent="center">
                    <IconDotsVertical size="18" />
                  </Center>
                </MenuButton>
              )}
            </ButtonGroup>
            {!isMe && (
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
                  icon={<IconUserX size={16} />}
                  label="Remove"
                  fontSize="sm"
                  py="6px"
                  onClick={() => onRequestRemove?.(id)}
                />
              </MenuList>
            )}
          </Menu>
        </Box>
      </Skeleton>
    </HStack>
  );
};

export const ClassTeacher = React.memo(ClassTeacherRaw);
