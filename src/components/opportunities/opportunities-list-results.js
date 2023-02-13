import { forwardRef, useState } from "react";
import { paramCase } from "param-case";
import PerfectScrollbar from "react-perfect-scrollbar";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import PropTypes from "prop-types";

import {
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
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
import OpportunityNewEdit from "./opportunity-new-edit";
import { useRouter } from "next/router";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export const OpportunitiesListResults = ({ opportunities, ...rest }) => {
  const { push } = useRouter();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [opport, setOpport] = useState({});

  const handleClose = () => {
    setOpen(false);
  };
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Card {...rest}>
        <PerfectScrollbar>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Volunteer</TableCell>
                  <TableCell>Edit</TableCell>
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
                    <TableCell>
                      <IconButton
                        color="info"
                        onClick={() => {
                          push(`opportunities/${paramCase(opportunity.name)}/volunteers`);
                        }}
                      >
                        <GroupsIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="success"
                        onClick={() => {
                          setOpen(true);
                          setOpport(opportunity);
                        }}
                      >
                        <EditIcon />
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
          count={opportunities?.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle textAlign="center">Edit Opportunity</DialogTitle>
        <DialogContent>
          <OpportunityNewEdit opportunity={opport} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

OpportunitiesListResults.propTypes = {
  opportunities: PropTypes.array,
};
