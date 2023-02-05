import {
  Divider,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconFolder } from "@tabler/icons-react";
import { useProfile } from "../../hooks/use-profile";
import { groupIntoTimeline } from "../../utils/groupings";
import { ProfileLinkable } from "./study-set-link";

export const FoldersList = () => {
  const profile = useProfile()!;
  const grouped = groupIntoTimeline(profile.folders);

  const dividerColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Stack spacing={8}>
      {grouped.map((x, i) => (
        <Stack spacing={6} key={i}>
          <Flex gap={4} alignItems="center">
            <Heading fontSize="2xl" whiteSpace="nowrap">{x.label}</Heading>
            <Divider borderColor={dividerColor} />
          </Flex>
          <Stack spacing={4}>
            {x.items.map((x) => (
              <ProfileLinkable
                key={x.id}
                title={x.title}
                url={`/@${profile.username}/folders/${x.slug}`}
                numValues={x.studySets.length}
                label="set"
                leftIcon={<IconFolder size="18" />}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
