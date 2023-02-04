import {
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconEdit } from "@tabler/icons-react";
import { visibilityIcon } from "../../common/visibility-icon";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { useSet } from "../../hooks/use-set";

export const HeadingArea = () => {
  const { id, title, terms, visibility } = useSet();
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack spacing={4} marginTop="10" maxW="1000px">
      <Heading size="2xl">{title}</Heading>
      <Flex justifyContent="space-between" maxW="1000px" h="32px">
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
        <SetCreatorOnly>
          <Button
            leftIcon={<IconEdit />}
            size="sm"
            variant="ghost"
            as={Link}
            href={`/${id}/edit`}
          >
            Edit
          </Button>
        </SetCreatorOnly>
      </Flex>
    </Stack>
  );
};
