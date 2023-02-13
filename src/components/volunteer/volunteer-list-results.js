import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import createAvatar from "../../utils/createAvatar";
import Avatar from "../Avatar";
import { Edit } from "@mui/icons-material";

export const VolunteerListResults = ({ volunteers, currentOpportunity, ...rest }) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>

                <TableCell>Phone</TableCell>

                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {volunteers.slice(0, limit).map((volunteer) => (
                <TableRow hover key={volunteer.id}>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar
                        alt={volunteer.name}
                        sx={{ mr: 2 }}
                        color={createAvatar(volunteer.name).color}
                      >
                        {createAvatar(volunteer.name).name}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {volunteer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {volunteer.email}
                    <IconButton color="primary">
                      <SendToMobileIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    {volunteer.phone}
                    <IconButton color="primary">
                      <ForwardToInboxIcon />
                    </IconButton>
                  </TableCell>

                  <TableCell>
                    <IconButton color="success">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={volunteers.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

VolunteerListResults.propTypes = {
  volunteers: PropTypes.array,
  currentOpportunity: PropTypes.object,
};
