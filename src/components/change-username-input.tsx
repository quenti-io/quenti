import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { USERNAME_REGEXP } from "../constants/characters";
import { useDebounce } from "../hooks/use-debounce";
import { api } from "../utils/api";
import { AnimatedCheckCircle } from "./animated-icons/check";
import { AnimatedXCircle } from "./animated-icons/x";

export interface ChangeUsernameInputProps {
  buttonLabel?: string;
  disabledIfUnchanged?: boolean;
  onChange?: () => void;
}

export const ChangeUsernameInput: React.FC<ChangeUsernameInputProps> = ({
  buttonLabel = "Done",
  disabledIfUnchanged = true,
  onChange,
}) => {
  const session = useSession();

  const inputBg = useColorModeValue("gray.200", "gray.750");
  const addonBg = useColorModeValue("gray.300", "gray.700");

  const [usernameValue, setUsernameValue] = React.useState(
    session.data!.user!.username
  );
  const debouncedUsername = useDebounce(usernameValue, 500);

  const checkUsername = api.user.checkUsername.useQuery(
    { username: debouncedUsername },
    {
      enabled: !!debouncedUsername.length,
    }
  );
  const changeUsername = api.user.changeUsername.useMutation({
    onSuccess: () => onChange?.(),
  });

  const gray = useColorModeValue("gray.500", "gray.400");
  const green = useColorModeValue("green.400", "green.300");
  const red = useColorModeValue("red.400", "red.300");

  const isProfane = checkUsername.data?.isProfane;
  const isTooLong = usernameValue.length > 40;
  const isInvalid =
    !USERNAME_REGEXP.test(usernameValue) || isProfane || isTooLong;

  return (
    <Stack gap={2}>
      <HStack gap={2}>
        <InputGroup size="lg">
          <Input
            fontWeight={700}
            variant="flushed"
            placeholder="Enter a username"
            bg={inputBg}
            disabled={changeUsername.isLoading}
            rounded="md"
            px="4"
            value={usernameValue}
            onChange={(e) => {
              if (!changeUsername.isLoading) setUsernameValue(e.target.value);
            }}
            isInvalid={isInvalid}
            className="highlight-block"
            _focus={{
              borderColor: isInvalid ? "red.300" : "orange.300",
              boxShadow: `0px 1px 0px 0px ${isInvalid ? "#fc8181" : "#ffa54c"}`,
            }}
          />
          <InputRightAddon
            bg={addonBg}
            px="3"
            color={
              checkUsername.isLoading
                ? gray
                : checkUsername.data?.available
                ? green
                : red
            }
          >
            {checkUsername.isLoading && !isInvalid ? (
              <Box w="24px" />
            ) : checkUsername.data?.available ? (
              <AnimatedCheckCircle />
            ) : (
              <AnimatedXCircle />
            )}
          </InputRightAddon>
        </InputGroup>
        <Button
          size="lg"
          isDisabled={
            isInvalid ||
            checkUsername.isLoading ||
            debouncedUsername !== usernameValue ||
            !checkUsername.data?.available ||
            (disabledIfUnchanged &&
              usernameValue === session.data!.user!.username)
          }
          onClick={() => changeUsername.mutate({ username: usernameValue })}
          isLoading={changeUsername.isLoading}
        >
          {buttonLabel}
        </Button>
      </HStack>
      <Text
        fontSize="sm"
        textAlign="left"
        color={gray}
        visibility={isInvalid ? "visible" : "hidden"}
      >
        {isTooLong
          ? "Username must be 40 characters or less."
          : isProfane
          ? "Profane usernames are not allowed."
          : "Only letters, numbers, underscores and dashes allowed."}
      </Text>
    </Stack>
  );
};
