import { Box, Stack, Text } from "@chakra-ui/react";

import { ScriptFormatter } from "../script-formatter";

export interface PromptDisplayProps {
  label: string;
  content: string;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  label,
  content,
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
          <ScriptFormatter>{content}</ScriptFormatter>
        </Text>
      </Box>
    </Stack>
  );
};
