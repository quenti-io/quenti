import { HeadSeo } from "@quenti/components/head-seo";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";
import { WithFooter } from "../../components/with-footer";

export const NoPublicSets = () => {
  return (
    <WithFooter>
      <HeadSeo
        title="No Public Sets"
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <Center h="calc(100vh - 160px)">
        <GhostMessage
          message="Welp, this is awkward"
          subheading="This folder doesn't have any public sets you can view."
          homeButton
        />
      </Center>
    </WithFooter>
  );
};
