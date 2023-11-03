import { HeadSeo } from "@quenti/components/head-seo";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";
import { WithFooter } from "../../components/with-footer";

export const Set404 = () => {
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
          message="Looks like you're outta luck"
          subheading="The study set you're looking for doesn't exist."
          homeButton
        />
      </Center>
    </WithFooter>
  );
};

export default Set404;
