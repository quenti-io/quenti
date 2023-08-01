import {
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useProfile } from "../../hooks/use-profile";
import { groupIntoTimeline } from "../../utils/groupings";
import { ProfileLinkable } from "./study-set-link";

export const StudySetsList = () => {
  const profile = useProfile()!;
  const grouped = groupIntoTimeline(profile.studySets);

  const dividerColor = useColorModeValue("gray.300", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const placeholder = !profile.isMe
    ? "This user doesn't have any public study sets."
    : "You haven't created any study sets yet.";

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
                url={`/${x.id}`}
                visibility={x.visibility}
                numValues={x._count.terms}
                label="term"
              />
            ))}
          </Stack>
        </Stack>
      ))}
      {!grouped.length && (
        <Stack>
          <Heading size="lg">Nothing Yet</Heading>
          <Text color={grayText}>{placeholder}</Text>
        </Stack>
      )}
    </Stack>
  );
};
