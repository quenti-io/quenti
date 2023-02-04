import {
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
  Tag,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { plural } from "../../utils/string";

export interface TitlePropertiesProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  numTerms: number;
}

export const TitleProperties: React.FC<TitlePropertiesProps> = ({
  title: _title,
  setTitle: apiSetTitle,
  description: _description,
  setDescription: apiSetDescription,
  tags,
  setTags,
  numTerms,
}) => {
  const [title, setTitle] = React.useState(_title);
  const [description, setDescription] = React.useState(_description);
  const [tagsInput, setTagsInput] = React.useState(tags.join(", "));
  const parsedTags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => !!tag.length);

  const tagBg = useColorModeValue("gray.200", "gray.750");

  return (
    <Stack spacing={6}>
      <Stack spacing={0}>
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          onBlur={() => {
            apiSetTitle(title);
          }}
          placeholder="Set Title"
          variant="unstyled"
          fontSize={["2xl", "3xl", "5xl"]}
          fontFamily="heading"
          fontWeight={700}
        />
        <Text color="gray.400">{plural(numTerms, "term")}</Text>
      </Stack>
      <Flex gap={8} flexDir={{base: "column", md: "row"}}>
        <AutoResizeTextarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          onBlur={() => {
            apiSetDescription(description);
          }}
          minHeight={36}
          placeholder="Add a description..."
          variant="filled"
          allowTab={false}
          w="full"
        />
        <Stack w="full" maxW={{base: "100%", md: "50%"}} spacing={4}>
          <Stack>
            <Heading size="lg">Tags</Heading>
            <Input
              placeholder="e.g. Science, Chemistry, Organic Chemistry"
              variant="flushed"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={() => {
                setTags(parsedTags);
              }}
            />
          </Stack>
          <HStack>
            {parsedTags.map((tag, i) => (
              <Tag key={i} bg={tagBg}>
                {tag}
              </Tag>
            ))}
          </HStack>
        </Stack>
      </Flex>
    </Stack>
  );
};
