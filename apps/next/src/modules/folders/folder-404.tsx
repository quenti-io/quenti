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
          message="Please don't get mad but..."
          subheading="The folder you're looking for doesn't exist."
          homeButton
        />
      </Center>
    </>
  );
};
