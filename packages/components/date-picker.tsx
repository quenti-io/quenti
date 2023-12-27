import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import React from "react";

import { getAvailableDatesInMonth } from "@quenti/lib/calendar";
import { daysInMonth, yyyymmdd } from "@quenti/lib/date-fns";
import { weekdayNames } from "@quenti/lib/weekday";

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  GridItem,
  HStack,
  Heading,
  IconButton,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export interface DatePickerProps {
  onChange: (date: Dayjs | null) => void;
  onMonthChange?: (date: Dayjs) => void;
  selected?: Dayjs | null;
  minDate?: Date;
  maxDate?: Date;
  // [YYYY-MM-DD]
  excludeDates?: string[];
}

interface DaysProps {
  onChange: (date: Dayjs | null) => void;
  minDate?: Date;
  selected?: Dayjs | null;
  browsingDate: Dayjs;
  excludeDates?: string[];
}

// TODO: make this configurable
const weekStart = 0;

interface DayProps {
  date: Dayjs;
  active: boolean;
  disabled: boolean;
  onClick?: () => void;
}

const Day: React.FC<DayProps> = ({ date, active, disabled, onClick }) => {
  return (
    <Button
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      mx="auto"
      w="full"
      h="full"
      variant="outline"
      colorScheme="gray"
      isDisabled={disabled}
      fontSize="xs"
      bg={active ? "gray.900" : "gray.200"}
      color={active ? "gray.50" : "auto"}
      _hover={{
        borderColor: "gray.900",
      }}
      rounded="md"
      _disabled={{
        bg: "transparent",
        borderColor: "transparent",
        color: "gray.300",
      }}
      _active={{
        bg: "auto",
      }}
      borderColor="transparent"
      borderWidth="1.5px"
      onClick={onClick}
      _dark={{
        color: active ? "gray.900" : "auto",
        _disabled: {
          color: "gray.600",
        },
        bg: active ? "gray.50" : !disabled ? "#3C4658" : "transparent",
        _hover: !disabled
          ? {
              borderColor: "white",
            }
          : {},
      }}
    >
      {date.date()}
    </Button>
  );
};

const Days: React.FC<DaysProps> = ({
  onChange,
  minDate,
  selected,
  browsingDate,
  excludeDates,
}) => {
  const weekdayOfFirst = browsingDate.date(1).day();

  const includedDates = getAvailableDatesInMonth({
    browsingDate: browsingDate.toDate(),
    minDate,
  });

  const days = Array((weekdayOfFirst - weekStart + 7) % 7).fill(
    null,
  ) as (Dayjs | null)[];

  for (
    let day = 1, dayCount = daysInMonth(browsingDate);
    day <= dayCount;
    day++
  ) {
    const date = browsingDate.set("date", day);
    days.push(date);
  }

  const isActive = (day: Dayjs) =>
    !!(selected && yyyymmdd(selected) === yyyymmdd(day));

  const daysToRenderForTheMonth = days.map((day) => {
    if (!day) return { day: null, disabled: true };
    return {
      day,
      disabled:
        !!(includedDates && !includedDates.includes(yyyymmdd(day))) ||
        !!(excludeDates && excludeDates.includes(yyyymmdd(day))),
    };
  });

  const useHandleInitialDateSelection = () => {
    const firstAvailableDateOfMonth = daysToRenderForTheMonth.find(
      (day) => !day.disabled,
    )?.day;

    const isSelectedDateAvailable = selected
      ? daysToRenderForTheMonth.some(({ day, disabled }) => {
          if (day && yyyymmdd(day) === yyyymmdd(selected) && !disabled)
            return true;
        })
      : false;

    if (!isSelectedDateAvailable && firstAvailableDateOfMonth) {
      // If selected date not available in the month, select the first available date of the month
      onChange(firstAvailableDateOfMonth);
    }

    if (!firstAvailableDateOfMonth) {
      onChange(null);
    }
  };

  React.useEffect(useHandleInitialDateSelection);

  return (
    <>
      {daysToRenderForTheMonth.map(({ day, disabled }, i) => (
        <Box
          key={day === null ? `e-${i}` : `day-${day.format()}`}
          position="relative"
          w="full"
          pt="100%"
        >
          {day !== null && (
            <Day
              date={day}
              active={isActive(day)}
              disabled={disabled}
              onClick={() => {
                onChange?.(day);
              }}
            />
          )}
        </Box>
      ))}
    </>
  );
};

export const DatePicker: React.FC<DatePickerProps & Partial<DaysProps>> = ({
  selected,
  onChange,
  onMonthChange,
  browsingDate: _browsingDate,
  minDate,
}) => {
  const browsingDate = _browsingDate || dayjs().startOf("month");

  const changeMonth = (delta: number) =>
    onMonthChange?.(browsingDate.add(delta, "month"));

  const month = browsingDate
    ? new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        new Date(browsingDate.year(), browsingDate.month()),
      )
    : null;

  const disabled = minDate ? browsingDate.isBefore(minDate) : false;

  return (
    <Stack spacing="3">
      <HStack justifyContent="space-between">
        <Flex alignItems="end" gap="1">
          <Heading fontSize="lg">{month}</Heading>
          <Text fontSize="sm" fontWeight={500} color="gray.500">
            {browsingDate.format("YYYY")}
          </Text>
        </Flex>
        <ButtonGroup size="xs" variant="ghost" colorScheme="gray" spacing="0">
          <IconButton
            icon={<IconChevronLeft size={16} />}
            aria-label="Previous month"
            color="gray.700"
            _dark={{
              color: "gray.300",
            }}
            isDisabled={disabled}
            onClick={() => changeMonth(-1)}
          />
          <IconButton
            icon={<IconChevronRight size={16} />}
            aria-label="Next month"
            color="gray.700"
            _dark={{
              color: "gray.300",
            }}
            onClick={() => changeMonth(1)}
          />
        </ButtonGroup>
      </HStack>
      <SimpleGrid columns={7} spacing={1}>
        {weekdayNames("en-US", 0, "short").map((weekDay) => (
          <GridItem key={weekDay} textAlign="center" color="gray.500">
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="1px"
              fontWeight={500}
            >
              {weekDay}
            </Text>
          </GridItem>
        ))}
      </SimpleGrid>
      <Box minW="304px">
        <SimpleGrid
          columns={7}
          spacing="1"
          // Include 6 rows to prevent layout shift
          templateRows="1fr 1fr 1fr 1fr 1fr 1fr"
        >
          <Days
            browsingDate={browsingDate}
            selected={selected}
            onChange={onChange}
            minDate={minDate}
          />
        </SimpleGrid>
      </Box>
    </Stack>
  );
};
