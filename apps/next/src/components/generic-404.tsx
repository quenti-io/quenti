import { HeadSeo } from "@quenti/components";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "./ghost-message";

export const Generic404 = () => {
  return (
    <>
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
    </>
  );
};
