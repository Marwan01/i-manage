import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Search as SearchIcon } from "../../icons/search";
import OpportunityNewEdit from "./opportunity-new-edit";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export const OpportunitiesListToolbar = (props) => {
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Volunteering Opportunities
        </Typography>
        <Box sx={{ m: 1 }}>
          {/* <Button startIcon={<DownloadIcon fontSize="small" />} sx={{ mr: 1 }}>
          Export
        </Button> */}
          <Button color="primary" variant="contained" onClick={handleAdd}>
            Add Volunteering Opportunity
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon color="action" fontSize="small">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search Volunteering Opportunity"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Dialog
        TransitionComponent={Transition}
        open={open}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle textAlign="center">New Opportunity</DialogTitle>
        <DialogContent>
          <OpportunityNewEdit opportunity={{}} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
