import React from "react";

import { Button, Center } from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";

export interface TermCardGapProps {
  index: number;
}

const TermCardGapRaw: React.FC<TermCardGapProps> = ({ index }) => {
  const addTerm = useSetEditorContext((s) => s.addTerm);

  return (
    <Center w="full" h="4" role="group">
      <Button
        zIndex={10}
        opacity={0}
        transform="scale(0)"
        _groupHover={{
          opacity: 0.9,
          transform: "scale(1)",
        }}
        size="sm"
        rounded="full"
        leftIcon={<IconPlus size={18} />}
        onClick={() => addTerm(index + 1)}
      >
        Add term here
      </Button>
    </Center>
  );
};

export const TermCardGap = React.memo(TermCardGapRaw);
