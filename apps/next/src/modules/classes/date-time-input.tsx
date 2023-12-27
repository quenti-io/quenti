import React from "react";

import { DateTimePicker } from "@quenti/components/date-time-picker";

import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@chakra-ui/react";

import { IconCalendar } from "@tabler/icons-react";

import { dtFormatter } from "../../utils/time";

export interface DateTimeInputProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
  placeholder = "Pick date and time",
}) => {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  return (
    <InputGroup
      w="max"
      size="sm"
      position="relative"
      zIndex={10}
      bg="white"
      _dark={{
        bg: "gray.900",
      }}
      rounded="lg"
      shadow="sm"
    >
      <Input
        value={value ? dtFormatter.format(new Date(value)) : undefined}
        placeholder={placeholder}
        onClick={() => setPickerOpen(true)}
      />
      <InputRightElement position="absolute">
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
              />
            </PopoverContent>
          </Popover>
        </Box>
      </InputRightElement>
    </InputGroup>
  );
};
