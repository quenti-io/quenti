import {
  Avatar,
  Box,
  ButtonGroup,
  Center,
  Checkbox,
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
  IconAlertCircle,
  IconBan,
  IconDotsVertical,
  IconExternalLink,
  IconSwitchHorizontal,
  IconUserX,
} from "@tabler/icons-react";
import React from "react";
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
  const [menuOpen, setMenuOpen] = React.useState(false);

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

  const SmSkeleton: React.FC<React.PropsWithChildren> = ({ children }) => (
    <Flex h="20px" alignItems="center">
      <SkeletonText skeletonHeight="12px" noOfLines={1} isLoaded={!skeleton}>
        {children}
      </SkeletonText>
    </Flex>
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
        <Skeleton fitContent h="4" rounded="md" isLoaded={!skeleton}>
          <Checkbox
            isChecked={selected}
            onChange={(e) => onSelect?.(user.id, e.target.checked)}
          />
        </Skeleton>
        <Skeleton rounded="full" fitContent isLoaded={!skeleton}>
          <Avatar src={user.image || undefined} width="36px" height="36px" />
        </Skeleton>
        <Stack spacing="2px">
          <SmSkeleton>
            <Text fontWeight={700} fontSize="sm">
              {user.name}
            </Text>
          </SmSkeleton>
          <SmSkeleton>
            <Text color={mutedColor} fontSize="sm">
              {user.email}
            </Text>
          </SmSkeleton>
        </Stack>
      </HStack>
      <HStack spacing="6">
        <Skeleton rounded="full" fitContent isLoaded={!skeleton}>
          {section ? (
            <Tag
              fontSize="xs"
              background={pillBg}
              variant="subtle"
              rounded="full"
            >
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
      </HStack>
    </HStack>
  );
};

export const ClassStudent = React.memo(ClassStudentRaw);
