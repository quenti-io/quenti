import {
  Avatar,
  Box,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "@quenti/prisma/client";
import { IconAlertCircle, IconExternalLink } from "@tabler/icons-react";
import React from "react";

export interface ClassStudentProps {
  user: Pick<User, "id" | "name" | "username" | "image" | "email">;
  section?: { id: string; name: string };
  skeleton?: boolean;
  selected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export const ClassStudentRaw: React.FC<ClassStudentProps> = ({
  user,
  section,
  skeleton = false,
  selected = false,
  onSelect,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverColor = useColorModeValue("gray.50", "gray.750");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const pillBg = useColorModeValue("gray.100", "gray.700");

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
      mb="-1px"
      px="18px"
      transition="background 0.2s ease-in-out"
      borderBottomWidth="1px"
      _hover={{
        background: hoverColor,
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
            <IconButton
              aria-label="Go to profile"
              icon={<IconExternalLink size={16} />}
            />
          </ButtonGroup>
        </Skeleton>
      </HStack>
    </HStack>
  );
};

export const ClassStudent = React.memo(ClassStudentRaw);
