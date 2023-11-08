import type { Editor } from "@tiptap/core";

import { ButtonGroup, type ButtonGroupProps } from "@chakra-ui/react";

import {
  IconBold,
  IconItalic,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";

import { HighlightColorPopover } from "./highlight-color-popover";
import { RichTextProperty } from "./rich-text-property";

export interface RichTextBarProps {
  activeEditor: Editor | null;
}

export const RichTextBar: React.FC<RichTextBarProps & ButtonGroupProps> = ({
  activeEditor,
  ...props
}) => {
  return (
    <ButtonGroup
      w="max"
      size="xs"
      variant="ghost"
      colorScheme="gray"
      spacing="1"
      bg="gray.50"
      shadow="sm"
      _dark={{
        bg: "gray.800",
      }}
      p="4px"
      rounded="full"
      {...props}
    >
      <RichTextProperty
        icon={IconBold}
        label="Bold"
        onClick={() => activeEditor?.chain().focus().toggleBold().run()}
        isActive={activeEditor?.isActive("bold")}
      />
      <RichTextProperty
        icon={IconItalic}
        label="Italic"
        onClick={() => activeEditor?.chain().focus().toggleItalic().run()}
        isActive={activeEditor?.isActive("italic")}
      />
      <RichTextProperty
        icon={IconUnderline}
        label="Underline"
        onClick={() => activeEditor?.chain().focus().toggleUnderline().run()}
        isActive={activeEditor?.isActive("underline")}
      />
      <RichTextProperty
        icon={IconStrikethrough}
        label="Strikethrough"
        onClick={() => activeEditor?.chain().focus().toggleStrike().run()}
        isActive={activeEditor?.isActive("strike")}
      />
      <HighlightColorPopover activeEditor={activeEditor} />
    </ButtonGroup>
  );
};
