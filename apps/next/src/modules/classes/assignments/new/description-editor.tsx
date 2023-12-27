import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import {
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconUnderline,
  type TablerIconsProps,
} from "@tabler/icons-react";

import { EmojiReplacer } from "../../../editor/extensions/emoji-replacer";
import { DescriptionEditorStyles } from "./description-editor-styles";

const extensions = [
  StarterKit,
  Link,
  Typography,
  Placeholder.configure({
    placeholder: "Assignment description...",
  }),
  EmojiReplacer,
  Underline,
];

export const DescriptionEditor = () => {
  const editor = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "p-4 focus:outline-none",
      },
    },
  });
  if (!editor) return null;

  return (
    <Stack
      borderWidth="2px"
      borderColor="gray.200"
      bg="white"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.700",
        _focusWithin: {
          borderColor: "blue.300",
        },
      }}
      rounded="lg"
      spacing="0"
      _focusWithin={{
        borderColor: "blue.500",
      }}
      transition="border-color 0.2s ease-in-out"
      shadow="sm"
    >
      <DescriptionEditorStyles />
      <HStack
        borderBottomWidth="2px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        p="2"
        px="2"
      >
        <ButtonGroup size="xs" variant="ghost" colorScheme="gray" spacing="1">
          <RichTextProperty
            icon={IconBold}
            label="Toggle bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <RichTextProperty
            icon={IconItalic}
            label="Toggle italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <RichTextProperty
            icon={IconUnderline}
            label="Toggle underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          />
          <RichTextProperty
            icon={IconStrikethrough}
            label="Toggle strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          />
        </ButtonGroup>
        <Box
          h="24px"
          w="2px"
          bg="gray.200"
          _dark={{ bg: "gray.700" }}
          rounded="full"
        />
        <ButtonGroup size="xs" variant="ghost" colorScheme="gray" spacing="1">
          <RichTextProperty
            icon={IconList}
            label="Toggle bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          />
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            icon={<IconListNumbers size={18} />}
            aria-label="Toggle ordered list"
          />
        </ButtonGroup>
        <Box
          h="24px"
          w="2px"
          bg="gray.200"
          _dark={{ bg: "gray.700" }}
          rounded="full"
        />
        <ButtonGroup size="xs" variant="ghost" colorScheme="gray" spacing="1">
          <RichTextProperty
            icon={IconArrowBackUp}
            label="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
          />
          <RichTextProperty
            icon={IconArrowForwardUp}
            label="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
          />
        </ButtonGroup>
      </HStack>
      <Box height={200} overflowY="auto" onClick={() => editor.chain().focus()}>
        <EditorContent editor={editor} />
      </Box>
    </Stack>
  );
};

interface RichTextPropertyProps {
  icon: React.FC<TablerIconsProps>;
  label: string;
  onClick: () => void;
  isActive: boolean | undefined;
}

export const RichTextProperty: React.FC<RichTextPropertyProps> = ({
  icon: Icon,
  onClick,
  label,
  isActive = false,
}) => {
  const activeBg = useColorModeValue("gray.200", "gray.700");

  return (
    <IconButton
      icon={<Icon size={18} />}
      rounded="md"
      aria-label={label}
      onClick={() => onClick()}
      bg={isActive ? activeBg : undefined}
    />
  );
};
