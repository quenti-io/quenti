import React from "react";
import { IconLoader2, TablerIconProps } from "@tabler/icons";

export interface IconButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.FunctionComponent<TablerIconProps>;
  label: string;
  loading?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  loading,
  ...props
}) => {
  const Icon = icon;

  return (
    <button className="default-button flex items-center gap-2" {...props}>
      {!loading ? (
        <Icon size={20} />
      ) : (
        <IconLoader2 className="animate-spin" size={20} />
      )}
      {label}
    </button>
  );
};
