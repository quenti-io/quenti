import React from "react";

import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconSearch } from "@tabler/icons-react";

import { ToggleGroup } from "./toggle-group";

export interface TimePickerProps {
  onChange: (hours: number, minutes: number) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ onChange }) => {
  const [index, setIndex] = React.useState(0);

  const t = (v: number) => (v < 10 ? `0${v}` : v);
  const format12h = (h: number, m: number) =>
    `${h % 12 != 0 ? h % 12 : 12}:${t(m)} ${h < 12 ? "AM" : "PM"}`;

  const times = React.useMemo(() => {
    const times = [];

    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        times.push({
          hours: i,
          minutes: j,
          _12h: format12h(i, j),
          _24h: `${t(i)}:${t(j)}`,
        });
      }
    }

    return times;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [filteredTimes, setFilteredTimes] = React.useState(times);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setFilteredTimes(
      times.filter((time) =>
        time._12h.toLowerCase().includes(search.toLowerCase()),
      ),
    );

    // If it's a valid time, add it to the list
    if (search.match(/(1[0-2]|0?[0-9]):[0-5][0-9]/i)) {
      const [hours, minutes] = search.split(":");
      const hourValue = parseInt(hours!.replace(/\D/g, "").slice(0, 2));
      const minuteValue = parseInt(minutes!.replace(/\D/g, "").slice(0, 2));

      if (hourValue > 23) return;

      setFilteredTimes((times) => {
        const exists = times.find(
          (time) => time.hours === hourValue && time.minutes === minuteValue,
        );

        if (exists) return times;

        const newTimes = [
          ...times,
          {
            hours: hourValue,
            minutes: minuteValue,
            _12h: format12h(hourValue, minuteValue),
            _24h: `${t(hourValue)}:${t(minuteValue)}`,
          },
        ];

        if (hourValue <= 12) {
          const nextHour = (hourValue + 12) % 24;

          newTimes.push({
            hours: nextHour,
            minutes: minuteValue,
            _12h: format12h(nextHour, minuteValue),
            _24h: `${t(nextHour)}:${t(minuteValue)}`,
          });
        }

        return newTimes;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box h="366px" w="200px">
      <Box
        borderBottomWidth="1px"
        borderBottomColor="gray.100"
        _dark={{
          borderBottomColor: "gray.700",
        }}
        p="3"
        px="3"
      >
        <HStack>
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none" color="gray.500" w="8">
              <IconSearch size={14} />
            </InputLeftElement>
            <Input
              isInvalid={false}
              placeholder="Time"
              pl="7"
              fontSize="xs"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </InputGroup>
          <ToggleGroup
            index={index}
            tabBorderColor={borderColor}
            onChange={(i) => setIndex(i)}
            size="xs"
            fontSize="10px"
            tabProps={{
              p: "2",
              h: "28px",
              fontWeight: 600,
            }}
          >
            <ToggleGroup.Tab>12h</ToggleGroup.Tab>
            <ToggleGroup.Tab>24h</ToggleGroup.Tab>
          </ToggleGroup>
        </HStack>
      </Box>
      <Box p="5" pb="5" overflowY="auto" h={309}>
        <Stack>
          {filteredTimes.map((time, i) => (
            <Button
              variant="outline"
              key={i}
              colorScheme="gray"
              size="sm"
              fontSize="sm"
              onClick={() => {
                onChange(time.hours, time.minutes);
              }}
            >
              {index === 0 ? time._12h : time._24h}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
