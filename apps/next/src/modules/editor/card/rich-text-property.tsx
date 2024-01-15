import { IconButton, useColorModeValue } from "@chakra-ui/react";

import type { TablerIconsProps } from "@tabler/icons-react";

export interface RichTextPropertyProps {
  icon: React.FC<TablerIconsProps>;
  label: string;
  onClick: () => void;
  isActive: boolean | undefined;
}

export const RichTextProperty: React.FC<RichTextPropertyProps> = ({
  icon: Icon,
  label,
  onClick,
  isActive = false,
}) => {
  const activeBg = useColorModeValue("gray.200", "gray.700");

  return (
    <IconButton
      icon={<Icon size={16} />}
      aria-label={label}
      rounded="full"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onClick()}
      bg={isActive ? activeBg : undefined}
    />
  );
};
