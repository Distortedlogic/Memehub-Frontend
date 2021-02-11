import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import { BUCKET_BASE_URL } from "src/utils/constants";

export default class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${BUCKET_BASE_URL}/logos/icon.png`}
          />
        </Head>
        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
