import {
  Avatar,
  Box,
  Flex,
  HStack,
  Heading,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { avatarUrl } from "@quenti/lib/avatar";
import { IconFolder } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { Link } from "../../components/link";
import { useFolder } from "../../hooks/use-folder";
import { plural } from "../../utils/string";

export const FolderHeading = () => {
  const folder = useFolder();

  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack spacing={4}>
      <HStack spacing="2" fontWeight={600}>
        <Text>{plural(folder.sets.length, "set")}</Text>
        <Text>&middot;</Text>
        <Text>created by</Text>
        <HStack spacing="2" fontWeight={700}>
          <Avatar
            src={avatarUrl(folder.user)}
            size="xs"
            className="highlight-block"
          />
          <Link
            href={`/@${folder.user.username}`}
            transition="color 200ms ease-in-out"
            _hover={{ color: highlight }}
            className="highlight-block"
            w="max-content"
          >
            {folder.user.username}
          </Link>
        </HStack>
      </HStack>
      <Heading size="2xl" lineHeight="40px">
        <Box as="span" verticalAlign="middle" mr="4">
          <IconFolder style={{ display: "inline" }} size={40} />
        </Box>
        <Box as="span" verticalAlign="middle">
          {folder.title.replace("-", " ")}
        </Box>
      </Heading>
    </Stack>
  );
};

FolderHeading.Skeleton = function FolderHeadingSkeleton() {
  const router = useRouter();
  const username = router.query.username as string | undefined;
  const slug = router.query.slug as string | undefined;

  const TextWrapper = ({ children }: { children: React.ReactNode }) => (
    <Flex alignItems="center" h="6">
      <SkeletonText noOfLines={1} skeletonHeight="20px">
        {children}
      </SkeletonText>
    </Flex>
  );

  return (
    <Stack spacing={4}>
      <HStack spacing="2" fontWeight={600}>
        <TextWrapper>
          <HStack spacing={2}>
            <Text>4 sets</Text>
            <Text>&middot;</Text>
            <Text>created by</Text>
          </HStack>
        </TextWrapper>
        <HStack spacing="2" fontWeight={700}>
          <Skeleton rounded="full">
            <Avatar size="xs" className="highlight-block" />
          </Skeleton>
          <TextWrapper>
            {username ? username.replace("@", "") : "username"}
          </TextWrapper>
        </HStack>
      </HStack>
      <Skeleton fitContent>
        <Heading size="2xl" lineHeight="40px">
          <Box as="span" verticalAlign="middle" mr="4">
            <IconFolder style={{ display: "inline" }} size={40} />
          </Box>
          <Box as="span" verticalAlign="middle">
            {slug || "folder title"}
          </Box>
        </Heading>
      </Skeleton>
    </Stack>
  );
};
