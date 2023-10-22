import omit from "lodash.omit";
import React from "react";
import ResizeTextArea from "react-textarea-autosize";

import { Textarea, type TextareaProps } from "@chakra-ui/react";

export const AutoResizeTextarea = React.forwardRef(function AutoResizeInternal(
  props: TextareaProps & { allowTab: boolean },
  ref,
) {
  const spaces = 4;
  const [text, setText] = React.useState<{
    value: string;
    caret: number;
    target: (EventTarget & HTMLTextAreaElement) | null;
  }>({
    value: "",
    caret: -1,
    target: null,
  });

  React.useEffect(() => {
    if (text.caret >= 0 && text.target)
      text.target.setSelectionRange(text.caret + spaces, text.caret + spaces);
  }, [text]);

  const handleTab = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const content = e.target.value;
    const caret = e.target.selectionStart;

    if (e.key === "Tab") {
      e.preventDefault();

      const newText =
        content.substring(0, caret) + "\t" + content.substring(caret);

      setText({ value: newText, caret: caret, target: e.target });
    }
  };

  const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText({ value: e.target.value, caret: -1, target: e.target });
    props.onChange?.(e);
  };

  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref as React.LegacyRef<HTMLTextAreaElement> | undefined}
      minRows={1}
      as={ResizeTextArea}
      {...omit(props, "allowTab")}
      onKeyDown={props.allowTab ? handleTab : props.onKeyDown}
      onChange={props.allowTab ? handleText : props.onChange}
      value={props.allowTab ? text.value : props.value}
    />
  );
});
