import { Select } from "chakra-react-select";

import type { StudySetAnswerMode } from "@quenti/prisma/client";

import { useColorModeValue } from "@chakra-ui/react";

export interface SelectAnswerModeProps {
  value: StudySetAnswerMode;
  onChange: (value: StudySetAnswerMode) => void;
}

const options: { label: string; value: StudySetAnswerMode }[] = [
  {
    label: "Term",
    value: "Word",
  },
  {
    label: "Definition",
    value: "Definition",
  },
  {
    label: "Both",
    value: "Both",
  },
];

export const SelectAnswerMode: React.FC<SelectAnswerModeProps> = ({
  value,
  onChange,
}) => {
  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  return (
    <Select
      selectedOptionStyle="check"
      value={options.find((o) => o.value === value)}
      isSearchable={false}
      onChange={(e) => {
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
        control: (provided) => ({
          ...provided,
          rounded: "lg",
        }),
        menuList: (provided) => ({
          ...provided,
          rounded: "lg",
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
