import React from "react";
import ResizeTextArea from "react-textarea-autosize";
import { Textarea, type TextareaProps } from "@chakra-ui/react";

export const AutoResizeTextarea = React.forwardRef(function AutoResizeInternal(
  props: TextareaProps,
  ref
) {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref as React.LegacyRef<HTMLTextAreaElement> | undefined}
      minRows={1}
      as={ResizeTextArea}
      {...props}
    />
  );
});
