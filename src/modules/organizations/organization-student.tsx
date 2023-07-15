import {
  Avatar,
  Flex,
  IconButton,
  Skeleton,
  SkeletonText,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import type { User } from "@prisma/client";
import { IconExternalLink } from "@tabler/icons-react";
import { Link } from "../../components/link";
import { avatarUrl } from "../../utils/avatar";
import React from "react";

interface OrganizationStudentProps {
  user: Pick<User, "id" | "name" | "username" | "email" | "image">;
  skeleton?: boolean;
}

const OrganizationStudentRaw: React.FC<OrganizationStudentProps> = ({
  user,
  skeleton = false,
}) => {
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
      <Td>
        <Flex alignItems="center" h="6">
          <SkeletonText
            isLoaded={!skeleton}
            fitContent
            noOfLines={1}
            w="max-content"
            skeletonHeight="5"
          >
            <Text fontWeight={600}>{user.name}</Text>
          </SkeletonText>
        </Flex>
      </Td>
      <Td>
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
      <Td pr="0" w="32px">
        <Skeleton rounded="md" isLoaded={!skeleton} fitContent>
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
      </Td>
    </Tr>
  );
};

export const OrganizationStudent = React.memo(OrganizationStudentRaw);
