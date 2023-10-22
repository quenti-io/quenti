export interface SelectOptionProps {
  value: string;
  label: string;
}

export const SelectOption: React.FC<SelectOptionProps> = ({ value, label }) => {
  return (
    <option
      value={value}
      style={{
        outline: "none",
        border: "none",
        borderRadius: "4px",
      }}
    >
      {label}
    </option>
  );
};
