import PropTypes from "prop-types";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AuthGuard } from "./auth-guard";
import { DashboardNavbar } from "./dashboard-navbar";

const DashboardLayoutRoot = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  paddingTop: 64,
}));

export const DashboardLayout = ({ children }) => (
  <AuthGuard>
    <DashboardLayoutRoot>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {children}
      </Box>
    </DashboardLayoutRoot>
    <DashboardNavbar />
  </AuthGuard>
);
DashboardLayout.propTypes = {
  children: PropTypes.node,
};
