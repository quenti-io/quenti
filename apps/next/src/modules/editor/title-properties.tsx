import React from "react";

import {
  Flex,
  HStack,
  Heading,
  Input,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";

export const TitleProperties = () => {
  const _title = useSetEditorContext((s) => s.title);
  const _description = useSetEditorContext((s) => s.description);
  const tags = useSetEditorContext((s) => s.tags);
  const numTerms = useSetEditorContext((s) => s.terms.length);
  const apiSetTitle = useSetEditorContext((s) => s.setTitle);
  const apiSetDescription = useSetEditorContext((s) => s.setDescription);
  const setTags = useSetEditorContext((s) => s.setTags);

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
      <Flex gap={8} flexDir={{ base: "column", md: "row" }}>
        <AutoResizeTextarea
          value={description}
          rounded="lg"
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
        <Stack w="full" maxW={{ base: "100%", md: "50%" }} spacing={4}>
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

TitleProperties.Skeleton = function TitlePropertiesSkeleton() {
  return (
    <Stack spacing={6}>
      <Stack spacing={0}>
        <Flex h="72px" alignItems="center">
          <SkeletonText
            maxW="300px"
            skeletonHeight="52px"
            noOfLines={1}
            rounded="md"
          >
            <Input
              placeholder="Set Title"
              w="full"
              variant="unstyled"
              fontSize={["2xl", "3xl", "5xl"]}
              fontFamily="heading"
              fontWeight={700}
            />
          </SkeletonText>
        </Flex>
        <Skeleton fitContent rounded="md">
          <Text color="gray.400">5 terms</Text>
        </Skeleton>
      </Stack>
      <Flex gap={8} flexDir={{ base: "column", md: "row" }}>
        <Skeleton fitContent rounded="lg" w="full">
          <AutoResizeTextarea
            rounded="lg"
            minHeight={36}
            placeholder="Add a description..."
            allowTab={false}
            w="full"
          />
        </Skeleton>
        <Stack w="full" maxW={{ base: "100%", md: "50%" }} spacing={4}>
          <Stack>
            <Skeleton fitContent rounded="md">
              <Heading size="lg">Tags</Heading>
            </Skeleton>
            <Skeleton fitContent rounded="lg" w="full">
              <Input
                w="full"
                placeholder="e.g. Science, Chemistry, Organic Chemistry"
                variant="flushed"
              />
            </Skeleton>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
};
