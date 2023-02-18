import { ButtonGroup, IconButton, Tooltip } from "@chakra-ui/react";
import {
  IconPlus,
  IconPrinter,
  IconShare,
  IconTableExport,
  type TablerIconsProps,
} from "@tabler/icons-react";
import type React from "react";

export const ActionArea: React.FC = () => {
  return (
    <ButtonGroup spacing={4}>
      <ActionButton label="Add to folder" icon={IconPlus} />
      <ActionButton label="Share" icon={IconShare} />
      <ActionButton label="Print" icon={IconPrinter} />
      <ActionButton label="Export" icon={IconTableExport} />
    </ButtonGroup>
  );
};

interface ActionButtonProps {
  label: string;
  icon: React.FC<TablerIconsProps>;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ label, icon }) => {
  const Icon = icon;

  return (
    <Tooltip label={label}>
      <IconButton
        icon={<Icon size={18} />}
        rounded="full"
        variant="outline"
        colorScheme="blue"
        aria-label={label}
        outline="solid 1px"
      />
    </Tooltip>
  );
};
