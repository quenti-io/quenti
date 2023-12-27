import React from "react";

import { DateTimePicker } from "@quenti/components/date-time-picker";

import {
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
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  value,
  onChange,
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
        value={dtFormatter.format(new Date(value ?? ""))}
        onClick={() => setPickerOpen(true)}
      />
      <InputRightElement>
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
              zIndex: 200000,
            }}
          >
            <DateTimePicker
              value={value}
              onChange={(v, time) => {
                onChange(v);
                if (time) setPickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </InputRightElement>
    </InputGroup>
  );
};
