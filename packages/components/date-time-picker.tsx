import dayjs, { type Dayjs } from "dayjs";
import React from "react";

import { Box, Flex } from "@chakra-ui/react";

import { DatePicker } from "./date-picker";
import { TimePicker } from "./time-picker";

export interface DateTimePickerProps {
  value: string | null;
  onChange: (date: string | null, time?: boolean) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<string | null>(
    value ? dayjs(value).format("YYYY-MM-DD") : null,
  );
  const [month, setMonth] = React.useState<string | null>(
    value ? dayjs(value).format("YYYY-MM") : null,
  );

  const changeDate = (date: Dayjs | null) => {
    if (!date) return;
    const newDate = dayjs(new Date(value || ""))
      .year(date.year())
      .month(date.month())
      .date(date.date());

    onChange(newDate.toISOString());
  };

  return (
    <Flex>
      <Box p="5">
        <DatePicker
          selected={dayjs(selectedDate)}
          onChange={(date: Dayjs | null) => {
            setSelectedDate(date === null ? date : date.format("YYYY-MM-DD"));
            changeDate(date);
          }}
          onMonthChange={(date: Dayjs) => {
            setMonth(date.format("YYYY-MM"));
            setSelectedDate(date.format("YYYY-MM-DD"));
            changeDate(date);
          }}
          browsingDate={month ? dayjs(month) : undefined}
        />
      </Box>
      <Box
        h="366px"
        w="1px"
        bg="gray.100"
        _dark={{
          bg: "gray.700",
        }}
      />
      <TimePicker
        onChange={(hours, minutes) => {
          onChange(
            dayjs(value)
              .set("hour", hours)
              .set("minute", minutes)
              .toISOString(),
            true,
          );
        }}
      />
    </Flex>
  );
};
