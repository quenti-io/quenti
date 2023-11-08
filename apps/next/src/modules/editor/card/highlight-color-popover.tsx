import type { Editor } from "@tiptap/core";
import React from "react";

import { A, Highlight } from "@quenti/lib/editor";

import {
  Box,
  Center,
  HStack,
  IconButton,
  Popover,
  PopoverAnchor,
  PopoverContent,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconCircle, IconColorPickerOff } from "@tabler/icons-react";

import { useOutsideClick } from "../../../hooks/use-outside-click";

export interface HighlightColorPopoverProps {
  activeEditor: Editor | null;
}

export const HighlightColorPopover: React.FC<HighlightColorPopoverProps> = ({
  activeEditor,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isActive = activeEditor?.isActive("highlight");
  const activeBg = useColorModeValue("gray.200", "gray.700");
  const attributes = activeEditor?.getAttributes("highlight");
  const color = isActive ? (attributes?.color as string) : undefined;

  const ref = useOutsideClick(() => {
    setIsOpen(false);
  });

  return (
    <Box ref={ref}>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="top"
        closeOnBlur={false}
        computePositionOnMount
        flip={false}
        // Solution to prevent focus trapping blurring editor
        trigger="hover"
        returnFocusOnClose={false}
      >
        <Box position="relative" w="6" h="6">
          <PopoverAnchor>
            <IconButton
              position="absolute"
              top="0"
              left="0"
              icon={
                <Box w="4" h="4" position="relative">
                  <IconCircle size={16} />
                  <Center
                    w="full"
                    h="full"
                    position="absolute"
                    top="0"
                    left="0"
                  >
                    <Box
                      w="7px"
                      h="7px"
                      rounded="full"
                      transition="background 0.2s ease-in-out"
                      bg={color ? color.slice(0, 7) : undefined}
                      position="relative"
                    >
                      <Box
                        position="absolute"
                        w="full"
                        h="full"
                        rounded="full"
                        top="0"
                        left="0"
                        transition="opacity 0.2s ease-in-out"
                        opacity={color ? 0 : 1}
                        bg="conic-gradient(#FC8181, #F6AD55, #F6E05E, #68D391, #63B3ED)"
                      />
                    </Box>
                  </Center>
                </Box>
              }
              aria-label="Bold"
              rounded="full"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                setIsOpen((o) => !o);
              }}
              bg={isActive ? activeBg : undefined}
            />
          </PopoverAnchor>
        </Box>
        <PopoverContent w="max" p="4px">
          <HStack spacing="0">
            {Object.values(Highlight).map((c) => (
              <IconButton
                rounded="full"
                key={c}
                icon={<Box key={c} w="3" h="3" rounded="full" bg={c} />}
                aria-label={c}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  activeEditor
                    ?.chain()
                    .focus()
                    .toggleHighlight({ color: c + A })
                    .run();
                  setIsOpen(false);
                }}
              />
            ))}
            <IconButton
              rounded="full"
              aria-label="Clear"
              onMouseDown={(e) => e.preventDefault()}
              icon={<IconColorPickerOff size={14} />}
              onClick={() => {
                activeEditor?.chain().focus().unsetHighlight().run();
                setIsOpen(false);
              }}
            />
          </HStack>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
