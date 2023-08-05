import { useColorModeValue } from "@chakra-ui/react";
import { Select } from "chakra-react-select";

interface SectionSelectProps {
  value: string;
  onChange: (value: string) => void;
  sections: {
    id: string;
    name: string;
  }[];
}

export const SectionSelect: React.FC<SectionSelectProps> = ({
  value,
  onChange,
  sections,
}) => {
  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
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
      size="sm"
      chakraStyles={{
        container: (provided) => ({
          ...provided,
          background: baseBg,
          rounded: "6px",
          width: 200,
        }),
        inputContainer: () => ({
          width: 200,
          rounded: "6px",
        }),
        control: (provided) => ({
          ...provided,
          rounded: "6px",
        }),
        menuList: (provided) => ({
          ...provided,
          rounded: "6px",
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
