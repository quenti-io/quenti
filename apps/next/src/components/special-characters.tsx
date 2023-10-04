import React from "react";

import { Button, Text, useColorModeValue } from "@chakra-ui/react";

import { useEventCallback } from "../hooks/use-event-callback";
import { ScriptFormatter } from "./script-formatter";

export const CharacterButtonWrapper: React.FC<{
  character: string;
  handler: (c: string) => void;
}> = ({ character, handler }) => {
  const callback = useEventCallback(() => handler(character));

  return <CharacterButtonPure character={character} onClick={callback} />;
};
const CharacterButton: React.FC<{ character: string; onClick: () => void }> = ({
  character,
  onClick,
}) => {
  const characterTextColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Button
      size="sm"
      variant="outline"
      display="inline-block"
      m="1"
      colorScheme="gray"
      fontWeight={600}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <Text color={characterTextColor}>
        <ScriptFormatter>{character}</ScriptFormatter>
      </Text>
    </Button>
  );
};
const CharacterButtonPure = React.memo(CharacterButton);
