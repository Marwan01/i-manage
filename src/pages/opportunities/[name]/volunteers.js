import Head from "next/head";
import { Box, Container } from "@mui/material";
import { VolunteerListResults } from "../../../components/volunteer/volunteer-list-results";
import { VolunteerListToolbar } from "../../../components/volunteer/volunteer-list-toolbar";
import { DashboardLayout } from "../../../components/dashboard-layout";

import { useRouter } from "next/router";
import useFirebase from "../../../hooks/useFirebase";
import { paramCase } from "param-case";
import { useEffect, useState } from "react";

const Page = () => {
  const { opportunities, getVolunteers, volunteers } = useFirebase();
  const { query } = useRouter();
  const [currentOpportunity, setCurrentOpportunity] = useState({});
  const { name } = query;

  useEffect(() => {
    setCurrentOpportunity(
      opportunities.find((opportunity) => paramCase(opportunity.name) === name)
    );
  }, [name, opportunities]);

  useEffect(() => {
    if (currentOpportunity?.id) {
      getVolunteers(currentOpportunity.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOpportunity]);

  return (
    <>
      <Head>
        <title>volunteer | iManage</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <VolunteerListToolbar currentOpportunity={currentOpportunity} />
          <Box sx={{ mt: 3 }}>
            <VolunteerListResults volunteers={volunteers} currentOpportunity={currentOpportunity} />
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
