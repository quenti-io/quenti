import {
  Avatar,
  Box,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconFolder } from "@tabler/icons-react";
import { Link } from "../../components/link";
import { useFolder } from "../../hooks/use-folder";
import { avatarUrl } from "../../utils/avatar";
import { plural } from "../../utils/string";

export const FolderHeading = () => {
  const folder = useFolder();

  const highlight = useColorModeValue("blue.500", "blue.200");

  return (
    <Stack spacing={4}>
      <HStack gap={2} fontWeight={600}>
        <Text>{plural(folder.sets.length, "set")}</Text>
        <Text>created by</Text>
        <HStack gap={0} fontWeight={700}>
          <Avatar
            src={avatarUrl(folder.user)}
            size="xs"
            className="highlight-block"
          />
          <Link
            href={`/@${folder.user.username}`}
            transition="color 200ms ease-in-out"
            _hover={{ color: highlight }}
            className="highlight-mask"
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
          {folder.title}
        </Box>
      </Heading>
    </Stack>
  );
};
