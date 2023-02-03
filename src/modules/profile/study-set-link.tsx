import {
  Box,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { StudySetVisibility } from "@prisma/client";
import { visibilityIcon } from "../../common/visibility-icon";
import { plural } from "../../utils/string";

interface StudySetLinkProps {
  id: string;
  title: string;
  numTerms: number;
  visibility: StudySetVisibility;
}

export const StudySetLink: React.FC<StudySetLinkProps> = ({
  id,
  title,
  numTerms,
  visibility,
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <LinkBox
      as="article"
      h="full"
      rounded="md"
      p="4"
      bg={linkBg}
      borderColor={linkBorder}
      borderWidth="2px"
      shadow="md"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
    >
      <Stack spacing={2}>
        <Text fontSize="sm">{plural(numTerms, "term")}</Text>
        <HStack>
          <Heading size="md">
            <LinkOverlay href={`/${id}`}>{title}</LinkOverlay>
          </Heading>
          {visibility !== "Public" ? (
            <Box color="gray.500">{visibilityIcon(visibility, 18)}</Box>
          ) : (
            ""
          )}
        </HStack>
      </Stack>
    </LinkBox>
  );
};
