import { Link } from "@quenti/components";

import { HStack, IconButton } from "@chakra-ui/react";

import { IconRotate, IconSettings, IconX } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";

export interface TestOptionsProps {
  onSettingsClick: () => void;
  onResetClick: () => void;
}

export const TestOptions: React.FC<TestOptionsProps> = ({
  onSettingsClick,
  onResetClick,
}) => {
  const rootUrl = useEntityRootUrl();

  return (
    <HStack
      w={{ base: "full", md: "auto" }}
      justifyContent={{ base: "space-between", md: "auto" }}
    >
      <HStack ml={{ base: "-2", md: 0 }}>
        <IconButton
          icon={<IconRotate />}
          aria-label="Restart"
          rounded="full"
          variant="ghost"
          onClick={onResetClick}
        />
        <IconButton
          icon={<IconSettings />}
          aria-label="Settings"
          rounded="full"
          variant="ghost"
          onClick={onSettingsClick}
        />
      </HStack>
      <IconButton
        colorScheme="gray"
        icon={<IconX />}
        aria-label="Back"
        rounded="full"
        variant="ghost"
        as={Link}
        href={rootUrl}
      />
    </HStack>
  );
};
