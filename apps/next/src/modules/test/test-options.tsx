import { Link } from "@quenti/components";

import { HStack, IconButton } from "@chakra-ui/react";

import { IconRotate, IconSettings, IconX } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";

export const TestOptions = () => {
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
        />
        <IconButton
          icon={<IconSettings />}
          aria-label="Settings"
          rounded="full"
          variant="ghost"
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
