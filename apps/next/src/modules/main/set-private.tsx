import { HeadSeo } from "@quenti/components/head-seo";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";
import { WithFooter } from "../../components/with-footer";

export const SetPrivate = () => {
  return (
    <WithFooter>
      <HeadSeo
        title="Set Private"
        nextSeoProps={{
          nofollow: true,
          noindex: true,
        }}
      />
      <Center h="calc(100vh - 160px)">
        <GhostMessage
          message="Sorry, this is super secret sauce"
          subheading="The study set you're trying to view is private."
          homeButton
        />
      </Center>
    </WithFooter>
  );
};

export default SetPrivate;
