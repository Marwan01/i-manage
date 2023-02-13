import Head from "next/head";
import { Box, Container } from "@mui/material";
import { OpportunitieListResults } from "../../components/opportunities/opportunities-list-results";
import { OpportunitieListToolbar } from "../../components/opportunities/opportunities-list-toolbar";
import { DashboardLayout } from "../../components/dashboard-layout";
import { customers } from "../../__mocks__/customers";

const Page = () => (
  <>
    <Head>
      <title>opportunities | iManage</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <OpportunitieListToolbar />
        <Box sx={{ mt: 3 }}>
          <OpportunitieListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
