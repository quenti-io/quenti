import { HeadSeo } from "@quenti/components/head-seo";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "./ghost-message";
import { WithFooter } from "./with-footer";

export const Generic404 = () => {
  return (
    <WithFooter>
      <HeadSeo
        title="Not Found"
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <Center h="calc(100vh - 160px)">
        <GhostMessage
          message="Aw shucks, we couldn't find that!"
          subheading="We couldn't find what you were looking for. Check the URL and try again."
          homeButton
        />
      </Center>
    </WithFooter>
  );
};
