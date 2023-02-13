import { useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import createAvatar from "../../utils/createAvatar";
import Avatar from "../Avatar";

export const OpportunitiesListResults = ({ opportunities, ...rest }) => {
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
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {opportunities?.slice(0, limit).map((opportunity) => (
                <TableRow hover key={opportunity.id}>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Avatar
                        alt={opportunity.name}
                        sx={{ mr: 2 }}
                        color={createAvatar(opportunity.name).color}
                      >
                        {createAvatar(opportunity.name).name}
                      </Avatar>
                      <Typography color="textPrimary" variant="body1">
                        {opportunity.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{opportunity.location}</TableCell>

                  <TableCell>{opportunity.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={opportunities?.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

OpportunitiesListResults.propTypes = {
  opportunities: PropTypes.array,
};
