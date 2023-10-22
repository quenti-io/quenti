import { Head, Html, Main, NextScript } from "next/document";

import { env } from "@quenti/env/client";
import { openSans, outfit, theme } from "@quenti/lib/chakra-theme";

import { ColorModeScript } from "@chakra-ui/react";

const Document = () => {
  return (
    <Html>
      <Head />
      <body
        className={`overflow-x-hidden bg-gray-50 dark:bg-gray-900 ${outfit.variable} ${openSans.variable}`}
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
