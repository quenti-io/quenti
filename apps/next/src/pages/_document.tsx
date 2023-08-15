import { Head, Html, Main, NextScript } from "next/document";

import { env } from "@quenti/env/client";

import { ColorModeScript } from "@chakra-ui/react";

import { theme } from "../lib/chakra-theme";

const Document = () => {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Indie+Flower:wght@400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body
        style={{
          overflowX: "hidden",
        }}
      >
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
        {env.NEXT_PUBLIC_BETTERUPTIME_ID && (
          <script
            src="https://uptime.betterstack.com/widgets/announcement.js"
            data-id={env.NEXT_PUBLIC_BETTERUPTIME_ID}
            async
            type="text/javascript"
          ></script>
        )}
      </body>
    </Html>
  );
};

export default Document;
