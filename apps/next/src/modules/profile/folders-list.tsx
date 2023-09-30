import {
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconFolder } from "@tabler/icons-react";

import { useProfile } from "../../hooks/use-profile";
import { groupIntoTimeline } from "../../utils/groupings";
import { ProfileLinkable } from "./profile-linkable";

export const FoldersList = () => {
  const profile = useProfile()!;
  const grouped = groupIntoTimeline(profile.folders);

  const dividerColor = useColorModeValue("gray.300", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const placeholder = !profile.isMe
    ? "This user hasn't created any folders."
    : "You haven't created any folders yet.";

  return (
    <Stack spacing={8}>
      {grouped.map((x, i) => (
        <Stack spacing={6} key={i}>
          <Flex gap={4} alignItems="center">
            <Heading fontSize="2xl" whiteSpace="nowrap">
              {x.label}
            </Heading>
            <Divider borderColor={dividerColor} />
          </Flex>
          <Stack spacing={4}>
            {x.items.map((x) => (
              <ProfileLinkable
                key={x.id}
                title={x.title}
                url={`/@${profile.username}/folders/${x.slug ?? x.id}`}
                numValues={x.studySets.length}
                label="set"
                leftIcon={<IconFolder size="18" className="min-w-[18px]" />}
              />
            ))}
          </Stack>
        </Stack>
      ))}
      {!grouped.length && (
        <Stack>
          <Heading size="lg">Nothing yet</Heading>
          <Text color={grayText}>{placeholder}</Text>
        </Stack>
      )}
    </Stack>
  );
};
