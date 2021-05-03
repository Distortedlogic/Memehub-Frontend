import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { StoreProvider } from "easy-peasy";
import Head from "next/head";
import { Fragment, useEffect } from "react";
import { Container } from "src/components/utils/Container";
import { useCurrentSeasonQuery } from "src/generated/graphql";
import { globalStore } from "src/store/store";
import theme from "../theme";

library.add(fab, fas);
const MyApp = ({
  Component,
  pageProps,
}: {
  Component: React.FC;
  pageProps: React.ComponentProps<any>;
}) => {
  const [{ data, error }] = useCurrentSeasonQuery();
  if (error) console.log(error);
  useEffect(() => {
    if (data?.currentSeason) {
      globalStore.getActions().settings.setSeason(data.currentSeason);
    }
    return () => {};
  }, [data]);
  return (
    <Fragment>
      <Head>
        <title>Memehub V2</title>
      </Head>
      <StoreProvider store={globalStore}>
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
      </StoreProvider>
    </Fragment>
  );
};

export default MyApp;
