import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Head from "next/head";
import { Fragment } from "react";
import { Container } from "src/components/utils/Container";
import theme from "../theme";

library.add(fab, fas);
const MyApp = ({
  Component,
  pageProps,
}: {
  Component: React.FC;
  pageProps: React.ComponentProps<any>;
}) => {
  return (
    <Fragment>
      <Head>
        <title>Memehub V2</title>
      </Head>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Container
            data-testid="MyApp"
            flexDirection="column"
            height="100%"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <Component {...pageProps} />
          </Container>
        </ColorModeProvider>
      </ChakraProvider>
    </Fragment>
  );
};

export default MyApp;
