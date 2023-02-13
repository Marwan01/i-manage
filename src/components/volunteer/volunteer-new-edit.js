import PropTypes from "prop-types";
import swal from "sweetalert";
import * as Yup from "yup";

import merge from "lodash/merge";

import { useMemo } from "react";
// form
import { useFormik, Form, FormikProvider } from "formik";

// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import DeleteIcon from "@mui/icons-material/Delete";

// Auth
import useFirebase from "../../hooks/useFirebase";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function VolunteerNewEdit({ currentOpportunity, volunteer, onCancel }) {
  const { updateVolunteer, createVolunteer, deleteVolunteer } = useFirebase();
  const isCreating = parseInt(Object?.keys(volunteer).length, 10) === 0;
  const getInitialValues = (volunteer) => {
    const _volunteer = {
      name: "",
      email: "",
      phone: "",
      id: "",
      opportunityId: currentOpportunity.id,
    };

    if (volunteer) {
      return merge({}, _volunteer, volunteer);
    }

    return _volunteer;
  };
  const volunteerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required "),
    email: Yup.string().email().required("email is required "),
    phone: Yup.number().required("phone is required "),
  });

  const handleDelete = async () => {
    if (!volunteer.id) return;
    try {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this volunteer!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          swal("Your volunteer has been deleted!", {
            icon: "success",
          });
          await deleteVolunteer(currentOpportunity.id, volunteer.id);
        } else {
          swal("Your opportunity is safe!");
        }
      });
    } catch (error) {
      console.error(error);
    }
    onCancel();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialValues = useMemo(() => getInitialValues(volunteer), [volunteer]);

  const formik = useFormik({
    initialValues,

    validationSchema: volunteerSchema,
    enableReinitialize: true,

    onSubmit: async () => {
      try {
        const newVolunteer = {
          phone: formik.values?.phone || volunteer?.phone,
          email: formik.values?.email || volunteer?.emai,
          name: formik.values?.name || volunteer?.name,
          opportunityId: currentOpportunity.id || volunteer?.opportunityId,
        };

        if (volunteer.id) {
          await updateVolunteer(volunteer.id, newVolunteer);
          onCancel();
        } else {
          await createVolunteer(newVolunteer);
          onCancel();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, isSubmitting } = formik;

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
              name="phone"
              label={"Phone Number"}
              {...getFieldProps("phone")}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
              fullWidth
            />
          </div>
        </Stack>

        <Stack spacing={3}>
          <TextField
            style={{ marginTop: "3%" }}
            name="email"
            label="Email Address"
            fullWidth
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />
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
VolunteerNewEdit.propTypes = {
  volunteer: PropTypes.object,
  onCancel: PropTypes.func,
  currentOpportunity: PropTypes.object,
};
