import {
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { api, type RouterOutputs } from "@quenti/trpc";
import { EnabledFeature } from "@quenti/trpc/server/common/constants";
import React from "react";

export const UserEnabledFlags = ({
  user,
}: {
  user: RouterOutputs["admin"]["getUsers"]["users"][number];
}) => {
  const utils = api.useContext();
  const [flags, setFlags] = React.useState(user.flags);
  const apiSetFlags = api.admin.setEnabledFlags.useMutation({
    onSuccess: async () => {
      await utils.admin.getUsers.invalidate();
    },
  });

  const featureColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Stack>
      <Heading size="md">Account Flags</Heading>
      {([EnabledFeature.ExtendedFeedbackBank] as EnabledFeature[])
        .sort()
        .map((f, i) => (
          <HStack key={i} spacing={4}>
            <Text color={featureColor}>{EnabledFeature[f]}</Text>
            <Switch
              isChecked={(flags & f) == f}
              onChange={(e) => {
                let newFlags;
                if (e.target.checked) {
                  newFlags = flags | f;
                } else {
                  newFlags = flags & ~f;
                }

                setFlags(newFlags);
                apiSetFlags.mutate({
                  userId: user.id,
                  flags: newFlags,
                });
              }}
            />
          </HStack>
        ))}
    </Stack>
  );
};
