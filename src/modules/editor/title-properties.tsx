import { Input, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { plural } from "../../utils/string";

export interface TitlePropertiesProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  numTerms: number;
}

export const TitleProperties: React.FC<TitlePropertiesProps> = ({
  title: _title,
  setTitle: apiSetTitle,
  description: _description,
  setDescription: apiSetDescription,
  numTerms,
}) => {
  const [title, setTitle] = React.useState(_title);
  const [description, setDescription] = React.useState(_description);

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
      <AutoResizeTextarea
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        onBlur={() => {
          apiSetDescription(description);
        }}
        minHeight={24}
        placeholder="Add a description..."
        variant="filled"
        allowTab={false}
      />
    </Stack>
  );
};
