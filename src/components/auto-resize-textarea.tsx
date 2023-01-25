import React from "react";
import ResizeTextArea from "react-textarea-autosize";
import { Textarea, TextareaProps } from "@chakra-ui/react";

export const AutoResizeTextarea = React.forwardRef((props: TextareaProps, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref as any}
      minRows={1}
      as={ResizeTextArea}
      {...props}
    />
  );
});
