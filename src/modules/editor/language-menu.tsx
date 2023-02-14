import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { Language } from "@prisma/client";
import React from "react";

export interface LanguageMenuProps {
  selected: Language;
  onChange: (l: Language) => void;
}

export const LanguageMenu: React.FC<LanguageMenuProps> = ({
  selected,
  onChange,
}) => {
  return (
    <Menu>
      <MenuButton>
        <Button size="sm" variant="ghost" as="div">
          {selected.toString()}
        </Button>
      </MenuButton>
      <MenuList>
        <MenuOptionGroup
          defaultValue="English"
          title="Language"
          type="radio"
          value={selected}
          onChange={(e) => onChange(e as Language)}
        >
          {Object.values(Language).map((l) => (
            <MenuItemOption key={l} value={l}>
              {l.toString()}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};
