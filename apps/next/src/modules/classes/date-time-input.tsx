import React from "react";

import { DateTimePicker } from "@quenti/components/date-time-picker";

import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  type InputProps,
  InputRightElement,
  Popover,
  PopoverAnchor,
  PopoverContent,
  Portal,
} from "@chakra-ui/react";

import { IconCalendar, IconX } from "@tabler/icons-react";

import { dtFormatter } from "../../utils/time";

export interface DateTimeInputProps {
  value: string | null;
  onChange: (date: string | null) => void;
  minDate?: string;
  nullable?: boolean;
  placeholder?: string;
  inputStyles?: InputProps;
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  minDate,
  nullable = false,
  placeholder = "Pick date and time",
  inputStyles,
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const clearable = nullable && value;

  return (
    <InputGroup
      w="full"
      size="sm"
      position="relative"
      zIndex={10}
      bg="white"
      _dark={{
        bg: "gray.900",
      }}
      rounded="lg"
      shadow="sm"
      {...inputStyles}
    >
      <Input
        value={value ? dtFormatter.format(new Date(value)) : ""}
        placeholder={placeholder}
        onClick={() => setPickerOpen(true)}
        pr="12"
        autoComplete="off"
        readOnly
      />
      <InputRightElement w="56px">
        <HStack spacing="0">
          <IconButton
            icon={<IconX size={14} />}
            size="xs"
            aria-label="Clear"
            variant="ghost"
            onClick={() => {
              setPickerOpen(false);
              onChange(null);
            }}
            colorScheme="gray"
            visibility={clearable ? "visible" : "hidden"}
            pointerEvents={clearable ? "auto" : "none"}
          />
          <Box position="relative" zIndex={20}>
            <Popover
              isOpen={pickerOpen}
              onClose={() => setPickerOpen(false)}
              isLazy
            >
              <PopoverAnchor>
                <IconButton
                  icon={<IconCalendar size={14} />}
                  size="xs"
                  aria-label="Pick date and time"
                  variant="ghost"
                  onClick={() => setPickerOpen(true)}
                  colorScheme="gray"
                />
              </PopoverAnchor>
              <Portal>
                <PopoverContent
                  w="max"
                  overflow="hidden"
                  rounded="xl"
                  bg="white"
                  _dark={{
                    bg: "gray.800",
                  }}
                  shadow="lg"
                  style={{
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  <DateTimePicker
                    value={value}
                    onChange={(v, time) => {
                      if (!value && !time) return;

                      onChange(v);
                      if (time) setPickerOpen(false);
                    }}
                    minDate={minDate}
                  />
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </HStack>
      </InputRightElement>
    </InputGroup>
  );
};
