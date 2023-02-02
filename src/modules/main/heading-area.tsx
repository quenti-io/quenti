import {
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { visibilityIcon } from "../../common/visibility-icon";
import { useSet } from "../../hooks/use-set";

export const HeadingArea = () => {
  const { title, terms, visibility } = useSet();
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack spacing={4} marginTop="10">
      <Heading size="2xl">{title}</Heading>
      <HStack color={text} fontWeight={600} spacing={2}>
        <HStack>
          {visibilityIcon(visibility, 18)}
          <Text>{visibility}</Text>
        </HStack>
        <Text>•</Text>
        <Text>
          {terms.length} term{terms.length != 1 ? "s" : ""}
        </Text>
      </HStack>
    </Stack>
  );
};
