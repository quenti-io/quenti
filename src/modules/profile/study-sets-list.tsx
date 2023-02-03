import {
  Divider,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useProfile } from "../../hooks/use-profile";
import { groupIntoTimeline } from "../../utils/groupings";
import { StudySetLink } from "./study-set-link";

export const StudySetsList = () => {
  const profile = useProfile()!;
  const grouped = groupIntoTimeline(profile.studySets);

  const dividerColor = useColorModeValue("gray.300", "gray.700");

  return (
    <Stack spacing={4}>
      {grouped.map((x, i) => (
        <Stack spacing={6} key={i}>
          <Flex gap={4} alignItems="center">
            <Heading fontSize="2xl">{x.label}</Heading>
            <Divider borderColor={dividerColor} />
          </Flex>
          <Stack spacing={4}>
            {x.items.map((x) => (
              <StudySetLink
                id={x.id}
                key={x.id}
                title={x.title}
                visibility={x.visibility}
                numTerms={x._count.terms}
              />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
