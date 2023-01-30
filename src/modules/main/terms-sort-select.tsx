import { useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React from "react";

const allOptions = [
  {
    label: "Your Stats",
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

  const baseBg = useColorModeValue("white", "gray.700");
  const dropdownBg = useColorModeValue("gray.100", "gray.600");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  return (
    <Select
      selectedOptionStyle="check"
      value={sortMethod}
      onChange={(e) => {
        setSortMethod(e!);
        onChange(e!.value);
      }}
      chakraStyles={{
        inputContainer: () => ({
          width: 100,
        }),
        valueContainer: (provided) => ({
          ...provided,
          backgroundColor: baseBg,
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
  );
};
