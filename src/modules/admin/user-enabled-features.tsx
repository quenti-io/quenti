import {
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { EnabledFeature } from "@prisma/client";
import React from "react";
import { api, type RouterOutputs } from "../../utils/api";

export const UserEnabledFeatures = ({
  user,
}: {
  user: RouterOutputs["admin"]["getUsers"]["users"][number];
}) => {
  const utils = api.useContext();
  const [features, setFeatures] = React.useState(user.features);
  const apiSetFeatures = api.admin.setEnabledFeatures.useMutation({
    onSuccess: async () => {
      await utils.admin.getUsers.invalidate();
    },
  });

  const featureColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Stack>
      <Heading size="md">Account Features</Heading>
      {(["ExtendedFeedbackBank"] as EnabledFeature[]).sort().map((f, i) => (
        <HStack key={i} spacing={4}>
          <Text color={featureColor}>{f}</Text>
          <Switch
            isChecked={features.includes(f)}
            onChange={(e) => {
              let newFeatures;
              if (e.target.checked) {
                newFeatures = [...features, f];
              } else {
                newFeatures = features.filter((ff) => ff !== f);
              }

              setFeatures(newFeatures);
              apiSetFeatures.mutate({
                userId: user.id,
                features: newFeatures,
              });
            }}
          />
        </HStack>
      ))}
    </Stack>
  );
};
