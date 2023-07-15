import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { User } from "@prisma/client";
import { avatarUrl } from "../../utils/avatar";
import { Link } from "../../components/link";
import { IconExternalLink } from "@tabler/icons-react";

interface OrganizationStudentProps {
  user: Pick<User, "id" | "name" | "username" | "email" | "image">;
  skeleton?: boolean;
}

export const OrganizationStudent: React.FC<OrganizationStudentProps> = ({
  user,
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
                <Text fontWeight={700} fontFamily="Outfit">
                  {user.name}
                </Text>
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
                  {user.email}
                </Text>
              </SkeletonText>
            </Flex>
          </Stack>
        </HStack>
        <Skeleton fitContent rounded="md" isLoaded={!skeleton}>
          <IconButton
            aria-label="View public profile"
            icon={<IconExternalLink size={18} />}
            as={Link}
            variant="outline"
            colorScheme="gray"
            size="sm"
            href={`/@${user.username}`}
          />
        </Skeleton>
      </Flex>
    </Box>
  );
};
