import { Link, MenuItem, Text, useColorModeValue } from "@chakra-ui/react";
import type { TablerIconsProps } from "@tabler/icons-react";

export interface MenuOptionProps {
  icon: React.ReactElement<TablerIconsProps, string>;
  label: string;
  link?: string;
  onClick?: () => void;
}

export const MenuOption: React.FC<MenuOptionProps> = ({
  icon,
  label,
  link,
  onClick,
}) => {
  const bg = useColorModeValue("white", "gray.800");
  const hover = useColorModeValue("gray.100", "gray.700");
  const color = useColorModeValue("black", "white");

  return (
    <MenuItem
      icon={icon}
      as={link ? Link : undefined}
      href={link ?? ""}
      bg={bg}
      _hover={{ bg: hover }}
      onClick={onClick}
      py="2"
      fontWeight={600}
      color={color}
    >
      <Text>{label}</Text>
    </MenuItem>
  );
};
