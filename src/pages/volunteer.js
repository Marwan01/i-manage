import Head from "next/head";
import { Box, Container } from "@mui/material";
import { VolunteerListResults } from "../components/volunteer/volunteer-list-results";
import { VolunteerListToolbar } from "../components/volunteer/volunteer-list-toolbar";
import { DashboardLayout } from "../components/dashboard-layout";
import { customers } from "../__mocks__/customers";

const Page = () => (
  <>
    <Head>
      <title>Volunteering Management | iManage</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <VolunteerListToolbar />
        <Box sx={{ mt: 3 }}>
          <VolunteerListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
