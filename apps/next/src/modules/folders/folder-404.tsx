import { HeadSeo } from "@quenti/components";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";

export const Folder404 = () => {
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
          message="We couldn't find this folder"
          subheading="It might have been deleted by the original creator."
          homeButton
        />
      </Center>
    </>
  );
};
