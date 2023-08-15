import { Select } from "chakra-react-select";

import type { MembershipRole } from "@quenti/prisma/client";

import { useColorModeValue } from "@chakra-ui/react";

export interface MemberRoleSelectProps {
  value: MembershipRole;
  onChange: (role: MembershipRole) => void;
  myRole: MembershipRole;
  isDisabled?: boolean;
}

const options: {
  label: string;
  value: MembershipRole;
  isDisabled?: boolean;
}[] = [
  {
    label: "Member",
    value: "Member",
  },
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Owner",
    value: "Owner",
  },
];

export const MemberRoleSelect: React.FC<MemberRoleSelectProps> = ({
  value,
  onChange,
  myRole,
  isDisabled,
}) => {
  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  const hydrateOptions = () => {
    if (myRole === "Admin") {
      return options.map((x) =>
        x.value === "Owner" ? { ...x, isDisabled: true } : x,
      );
    }

    return options;
  };

  return (
    <Select
      selectedOptionStyle="check"
      value={options.find((o) => o.value === value)}
      isSearchable={false}
      isDisabled={isDisabled}
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
        option: (props, option) => ({
          ...props,
          cursor: option.isDisabled ? "not-allowed" : "pointer",
          backgroundColor: option.isDisabled
            ? undefined
            : props.backgroundColor,
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          paddingX: 2,
          backgroundColor: dropdownBg,
          color: chevronColor,
        }),
      }}
      options={hydrateOptions().sort(
        (a, b) => (a.isDisabled ? 1 : 0) - (b.isDisabled ? 1 : 0),
      )}
    />
  );
};
