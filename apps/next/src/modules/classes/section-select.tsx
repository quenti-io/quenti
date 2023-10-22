import { Select } from "chakra-react-select";

import { useColorModeValue } from "@chakra-ui/react";

interface SectionSelectProps {
  value: string;
  onChange: (value: string) => void;
  sections: {
    id: string;
    name: string;
  }[];
  size?: "md" | "sm";
}

export const SectionSelect: React.FC<SectionSelectProps> = ({
  value,
  onChange,
  sections,
  size = "md",
}) => {
  const baseBg = useColorModeValue("white", "gray.800");
  const dropdownBg = useColorModeValue("gray.100", "gray.750");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  const options = sections.map((x) => ({ value: x.id, label: x.name }));

  return (
    <Select
      selectedOptionStyle="check"
      value={options.find((o) => o.value === value)}
      isSearchable={false}
      onChange={(e) => {
        onChange(e!.value);
      }}
      size={size}
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          background: baseBg,
          rounded: "6px",
        }),
        inputContainer: () => ({
          rounded: "6px",
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
          rounded: "6px",
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
  );
};
