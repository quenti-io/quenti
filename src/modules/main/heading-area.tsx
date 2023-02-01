import {
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconLink, IconLock, IconWorld } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const HeadingArea = () => {
  const { title, terms, visibility } = useSet();
  const text = useColorModeValue("gray.600", "gray.400");

  const icon = () => {
    switch (visibility) {
      case "Public":
        return <IconWorld size={18} />;
      case "Unlisted":
        return <IconLink size={18} />;
      case "Private":
        return <IconLock size={18} />;
    }
  };

  return (
    <Stack spacing={4} marginTop="10">
      <Heading size="2xl">{title}</Heading>
      <HStack color={text} fontWeight={600} spacing={2}>
        <HStack>
          {icon()}
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
