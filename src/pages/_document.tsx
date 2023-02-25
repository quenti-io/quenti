import { ColorModeScript, theme } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";

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
      </body>
    </Html>
  );
};

export default Document;
