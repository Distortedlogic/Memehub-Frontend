import { Flex, FormControl, Grid } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import InputField from "src/components/InputField";
import { urqlClient } from "src/urql/urqlClient";
import { Layout } from "./_layout";

interface loginProps {}

const login: React.FC<loginProps> = () => {
  return (
    <Layout>
      <Grid h="100%" w="100%" templateColumns="2fr 1fr">
        <Flex>
          <Formik initialValues={{ url: "" }} onSubmit={async (values) => {}}>
            {({ isSubmitting }) => (
              <Form>
                <FormControl>
                  <Flex direction="column">
                    <InputField name="url" />
                  </Flex>
                </FormControl>
              </Form>
            )}
          </Formik>
        </Flex>
      </Grid>
    </Layout>
  );
};
export default withUrqlClient(urqlClient)(login);
