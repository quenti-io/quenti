import { Link } from "@quenti/components";

import { Center, HStack, IconButton, Skeleton } from "@chakra-ui/react";

import { IconRotate, IconSettings, IconX } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";

export interface TestOptionsProps {
  onSettingsClick: () => void;
  onResetClick: () => void;
  skeleton?: boolean;
}

export const TestOptions: React.FC<TestOptionsProps> = ({
  onSettingsClick,
  onResetClick,
  skeleton = false,
}) => {
  const rootUrl = useEntityRootUrl();

  const SkeletonWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    if (!skeleton) return <>{children}</>;
    return (
      <Center w="10" h="10">
        <Skeleton rounded="full" w="8" h="8" />
      </Center>
    );
  };

  return (
    <HStack
      w={{ base: "full", md: "auto" }}
      justifyContent={{ base: "space-between", md: "auto" }}
    >
      <HStack ml={{ base: "-2", md: 0 }}>
        <SkeletonWrapper>
          <IconButton
            icon={<IconRotate />}
            aria-label="Restart"
            rounded="full"
            variant="ghost"
            onClick={onResetClick}
          />
        </SkeletonWrapper>
        <SkeletonWrapper>
          <IconButton
            icon={<IconSettings />}
            aria-label="Settings"
            rounded="full"
            variant="ghost"
            onClick={onSettingsClick}
          />
        </SkeletonWrapper>
      </HStack>
      <SkeletonWrapper>
        <IconButton
          colorScheme="gray"
          icon={<IconX />}
          aria-label="Back"
          rounded="full"
          variant="ghost"
          as={Link}
          href={rootUrl}
        />
      </SkeletonWrapper>
    </HStack>
  );
};
