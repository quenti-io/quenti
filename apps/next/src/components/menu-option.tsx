// eslint-disable-next-line no-restricted-imports
import React from "react";

import { Link } from "@quenti/components";

import {
  MenuItem,
  type MenuItemProps,
  Text,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react";

import type { TablerIconsProps } from "@tabler/icons-react";

export interface MenuOptionProps {
  icon: React.ReactElement<TablerIconsProps, string>;
  label: string;
  href?: string;
  onClick?: () => void;
}

export const MenuOption = forwardRef<MenuItemProps & MenuOptionProps, "div">(
  ({ icon, label, href, onClick, ...props }) => {
    const hover = useColorModeValue("gray.100", "gray.700");
    const bg = useColorModeValue("white", "gray.800");
    const color = useColorModeValue("black", "white");

    return (
      <MenuItem
        icon={icon}
        as={href ? Link : undefined}
        href={href}
        bg={bg}
        _hover={{ bg: hover }}
        onClick={onClick}
        py="2"
        fontWeight={600}
        color={color}
        {...props}
      >
        <Text>{label}</Text>
      </MenuItem>
    );
  },
);

export const MenuOptionPure = React.memo(MenuOption);
