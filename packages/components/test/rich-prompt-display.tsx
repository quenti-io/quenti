import type { JSONContent } from "@tiptap/react";

import type { Prisma } from "@quenti/prisma/client";

import { Box, Stack, Text } from "@chakra-ui/react";

import { Display } from "../display";

export interface RichPromptDisplayProps {
  label: string;
  text: string;
  richText?: Prisma.JsonValue | JSON | JSONContent;
}

export const RichPromptDisplay: React.FC<RichPromptDisplayProps> = ({
  label,
  text,
  richText,
}) => {
  return (
    <Stack w="full">
      <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
        {label}
      </Text>
      <Box minH={{ base: "60px", md: "140px" }}>
        <Text
          fontSize={{ base: "md", sm: "lg", md: "xl" }}
          whiteSpace="pre-wrap"
          overflowWrap="anywhere"
        >
          <Display text={text} richText={richText} />
        </Text>
      </Box>
    </Stack>
  );
};
