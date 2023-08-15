import { H } from "highlight.run";
import { useSession } from "next-auth/react";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  HStack,
  Stack,
  Switch,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { SectionWrapper } from "./section-wrapper";

export const DataUsage = () => {
  const session = useSession()!.data!;
  const grayText = useColorModeValue("gray.600", "gray.400");

  const [enabled, setEnabled] = React.useState(
    Boolean(session?.user?.enableUsageData),
  );

  const setEnabledUsageData = api.user.setEnableUsageData.useMutation({
    onSuccess: () => {
      H.stop();
    },
  });

  if (!session.user) return null;

  return (
    <SectionWrapper
      heading="Privacy"
      description={
        <>
          We use an open-source service called{" "}
          <Link
            href="https://www.highlight.io"
            color="blue.300"
            fontWeight={600}
          >
            Highlight
          </Link>{" "}
          to collect anonymous data in order to debug and improve your
          experience in case of crashes and errors. You can opt out of this
          feature at any time, but keep in mind that your experience will most
          likely be hindered.
        </>
      }
    >
      <Stack>
        <HStack spacing={4}>
          <Switch
            size="lg"
            isChecked={enabled}
            onChange={(e) => {
              setEnabled(e.target.checked);
              setEnabledUsageData.mutate({ enableUsageData: e.target.checked });
            }}
          />
          <Text color={grayText} fontSize="sm">
            Report anonymous usage data to improve Quenti
          </Text>
        </HStack>
      </Stack>
    </SectionWrapper>
  );
};
