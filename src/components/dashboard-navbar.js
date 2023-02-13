import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { AppBar, Avatar, Box, IconButton, Toolbar, Tooltip } from "@mui/material";

import { UserCircle as UserCircleIcon } from "../icons/user-circle";

import { AccountPopover } from "./account-popover";

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export const DashboardNavbar = (props) => {
  const { ...other } = props;
  const settingsRef = useRef(null);
  const [openAccountPopover, setOpenAccountPopover] = useState(false);

  return (
    <>
      <DashboardNavbarRoot {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <Tooltip title="Home">
            <IconButton sx={{ ml: 1 }} onClick={()=>window.location='/'}>
              <img fontSize="small" alt="go to home" width="40vh" height="40vh" src="/static/logo.svg"/>
            </IconButton>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />

          <Avatar
            onClick={() => setOpenAccountPopover(true)}
            ref={settingsRef}
            sx={{
              cursor: "pointer",
              height: 40,
              width: 40,
              ml: 1,
            }}
            src="/static/images/avatars/avatar_1.png"
          >
            <UserCircleIcon fontSize="small" />
          </Avatar>
        </Toolbar>
      </DashboardNavbarRoot>
      <AccountPopover
        anchorEl={settingsRef.current}
        open={openAccountPopover}
        onClose={() => setOpenAccountPopover(false)}
      />
    </>
  );
};
