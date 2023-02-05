import {
  HStack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconInfoCircle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { SectionWrapper } from "./section-wrapper";

export const GAccountInfo = () => {
  const session = useSession()!.data!;

  const grayText = useColorModeValue("gray.600", "gray.400");

  if (!session.user) return null;

  return (
    <SectionWrapper
      heading="Google Account"
      description="Readonly information about your Google account. Only you can see this."
    >
      <Stack spacing={0}>
        <Text fontSize="xl">{session.user.name}</Text>
        <HStack color={grayText}>
          <Text fontSize="sm">{session.user.email}</Text>
          <Tooltip label="Your email is not shared with anyone">
            <IconInfoCircle size={18} />
          </Tooltip>
        </HStack>
      </Stack>
    </SectionWrapper>
  );
};
