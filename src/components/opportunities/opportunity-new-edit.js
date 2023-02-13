import PropTypes from "prop-types";
import swal from "sweetalert";
import * as Yup from "yup";

import merge from "lodash/merge";

import { useMemo } from "react";
// form
import { useFormik, Form, FormikProvider, Field } from "formik";

// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";

// Auth
import useFirebase from "../../hooks/useFirebase";

// ----------------------------------------------------------------------

const getInitialValues = (opportunity) => {
  const _opportunity = {
    name: "",
    location: "",
    date: "",
    id: "",
  };

  if (opportunity) {
    return merge({}, _opportunity, opportunity);
  }

  return _opportunity;
};

// ----------------------------------------------------------------------

export default function OpportunityNewEdit({ opportunity, onCancel }) {
  const { updateOpportunity, createOpportunity, deleteOpportunity } = useFirebase();
  const isCreating = parseInt(Object?.keys(opportunity).length, 10) === 0;

  const opportunitySchema = Yup.object().shape({
    name: Yup.string().required("Name is required "),
    location: Yup.string().required("Location is required "),
    date: Yup.date().required("Date is required "),
  });

  const handleDelete = async () => {
    if (!opportunity.id) return;
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this opportunity!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          swal("Your opportunity has been deleted!", {
            icon: "success",
          });
          await deleteOpportunity(opportunity.id);
        } else {
          swal("Your opportunity is safe!");
        }
      });
    } catch (error) {
      console.error(error);
    }
    onCancel();
  };

  const initialValues = useMemo(() => getInitialValues(opportunity), [opportunity]);

  const formik = useFormik({
    initialValues,

    validationSchema: opportunitySchema,
    enableReinitialize: true,

    onSubmit: async () => {
      try {
        const newOpportunity = {
          location: formik.values?.location || opportunity?.location,
          date:
            !opportunity.id && formik.values?.date
              ? formik.values?.date?.toJSON().slice(0, 10)
              : opportunity?.date,

          name: formik.values?.name || opportunity?.name,
        };

        if (opportunity.id) {
          await updateOpportunity(opportunity.id, newOpportunity);
          onCancel();
        } else {
          await createOpportunity(newOpportunity);
          onCancel();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting, setFieldValue, values } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ marginTop: "3%" }}
              autofucus="true"
              name="name"
              label={"Name"}
              {...getFieldProps("name")}
              error={Boolean(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              fullWidth
            />
            <TextField
              style={{ marginTop: "3%", marginLeft: "5%" }}
              name="location"
              label={"Location"}
              {...getFieldProps("location")}
              error={Boolean(touched.location && errors.location)}
              helperText={touched.location && errors.location}
              fullWidth
            />
          </div>
        </Stack>

        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Field
              as={MobileDatePicker}
              name="date"
              onChange={(value) => setFieldValue("date", value)}
              label={"Date"}
              value={values.date}
              renderInput={(params) => (
                <TextField
                  style={{ marginTop: "3%" }}
                  {...params}
                  fullWidth
                  {...getFieldProps("date")}
                  error={Boolean(touched.date && errors.date)}
                  helperText={touched.date && errors.date}
                />
              )}
            />
          </LocalizationProvider>
        </Stack>
        <DialogActions>
          {!isCreating && (
            <Tooltip title="Delete Patient">
              <IconButton onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          <Box sx={{ flexGrow: 1 }} />

          <Button variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isCreating ? "Save Change" : "create"}
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
OpportunityNewEdit.propTypes = {
  opportunity: PropTypes.object,
  onCancel: PropTypes.func,
};
