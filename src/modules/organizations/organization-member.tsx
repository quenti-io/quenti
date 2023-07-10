import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import type { MembershipRole, User } from "@prisma/client";
import { avatarUrl } from "../../utils/avatar";
import { IconExternalLink } from "@tabler/icons-react";
import { Link } from "../../components/link";

export interface OrganizationMemberProps {
  user: Pick<User, "id" | "name" | "username" | "email" | "image">;
  role: MembershipRole;
  accepted?: boolean;
  isCurrent?: boolean;
  skeleton?: boolean;
}

export const OrganizationMember: React.FC<OrganizationMemberProps> = ({
  user,
  role,
  isCurrent = false,
  accepted = true,
  skeleton = false,
}) => {
  const borderColor = useColorModeValue("gray.100", "gray.750");
  const bg = useColorModeValue("white", "gray.800");

  return (
    <Box
      px="4"
      py="3"
      border="2px"
      bg={bg}
      borderColor={borderColor}
      rounded="lg"
      transition="border-color 0.2s ease-in-out"
      _hover={
        !skeleton
          ? {
              borderLeftColor: "blue.300",
            }
          : {}
      }
    >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing="4">
          <Skeleton isLoaded={!skeleton} fitContent rounded="full" h="32px">
            <Avatar
              size="sm"
              src={!skeleton ? avatarUrl({ ...user, image: user.image! }) : ""}
            />
          </Skeleton>
          <Stack spacing="0">
            <Flex alignItems="center" h="6">
              <SkeletonText
                isLoaded={!skeleton}
                fitContent
                noOfLines={1}
                skeletonHeight="5"
              >
                <HStack>
                  <Text fontWeight={700} fontFamily="Outfit">
                    {user.name}
                  </Text>
                  {!accepted && (
                    <Tag size="sm" colorScheme="orange">
                      Pending
                    </Tag>
                  )}
                  {isCurrent && (
                    <Tag size="sm" colorScheme="blue">
                      You
                    </Tag>
                  )}
                </HStack>
              </SkeletonText>
            </Flex>
            <Flex alignItems="center" h="21px">
              <SkeletonText
                isLoaded={!skeleton}
                noOfLines={1}
                fitContent
                skeletonHeight="3"
              >
                <Text fontSize="sm" color="gray.500">
                  {role} <b>&middot;</b> {user.email}
                </Text>
              </SkeletonText>
            </Flex>
          </Stack>
        </HStack>
        <Skeleton fitContent rounded="md" isLoaded={!skeleton}>
          <Tooltip label="View public profile" placement="top">
            <span>
              <IconButton
                aria-label="View public profile"
                size="sm"
                icon={<IconExternalLink size={18} />}
                as={Link}
                href={`/@${user.username}`}
                variant="ghost"
              />
            </span>
          </Tooltip>
        </Skeleton>
      </Flex>
    </Box>
  );
};
