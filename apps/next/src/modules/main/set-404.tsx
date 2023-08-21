import { HeadSeo } from "@quenti/components";

import { Center } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";

export const Set404 = () => {
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
          message="Looks like you're outta luck"
          subheading="The study set you're looking for doesn't exist."
          homeButton
        />
      </Center>
    </>
  );
};

export default Set404;
