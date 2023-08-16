import { Select } from "chakra-react-select";
import React from "react";

import { Box, useColorModeValue } from "@chakra-ui/react";

const allOptions = [
  {
    label: "Your stats",
    value: "stats",
  },
  {
    label: "Original",
    value: "original",
  },
  {
    label: "Alphabetical",
    value: "alphabetical",
  },
];

interface TermsSortSelectProps {
  studiable: boolean;
  onChange: (value: string) => void;
}

export const TermsSortSelect: React.FC<TermsSortSelectProps> = ({
  studiable,
  onChange,
}) => {
  const options = studiable ? allOptions : allOptions.slice(1);
  const [sortMethod, setSortMethod] = React.useState(options[0]!);

  const baseBg = useColorModeValue("white", "gray.800");
  const dropdownBg = useColorModeValue("gray.100", "gray.750");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  return (
    <Box w="48">
      <Select
        selectedOptionStyle="check"
        isSearchable={false}
        value={sortMethod}
        onChange={(e) => {
          setSortMethod(e!);
          onChange(e!.value);
        }}
        chakraStyles={{
          container: (provided) => ({
            ...provided,
            background: baseBg,
            rounded: "lg",
          }),
          inputContainer: () => ({
            width: 100,
            rounded: "lg",
          }),
          option: (provided) => ({
            ...provided,
            bg: baseBg,
            whiteSpace: "nowrap",
            display: "block",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            _hover: {
              bg: dropdownBg,
            },
          }),
          control: (provided) => ({
            ...provided,
            rounded: "6px",
          }),
          menuList: (provided) => ({
            ...provided,
            rounded: "lg",
            bg: baseBg,
            shadow: "lg",
            overflowY: "auto",
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            paddingX: 2,
            backgroundColor: dropdownBg,
            color: chevronColor,
          }),
        }}
        options={options}
      />
    </Box>
  );
};
