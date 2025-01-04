import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IconLoader2 } from '@tabler/icons';
import { createNewDesignation } from '../../../../store/hr/DesignationSlice';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import AlertMessage from '../../../../components/shared/AlertMessage';

const AddDesignation = ({
  setAddDesignation,
  setDesignations,
  firmId,
  setItemAdded,
  edit,
  designation,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: '',
    message: '',
  });

  const validationSchema = Yup.object({
    label: Yup.string().trim().required('Designation is required'),
  });

  const formik = useFormik({
    initialValues: {
      label: designation?.label ? designation.label : '',
      firmId: firmId,
      id: designation?.label ? designation.id : '0',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      let formData = new FormData();
      formData.append('label', values.label.trim());
      formData.append('firmId', values.firmId);
      formData.append('id', values.id);
      setLoading(true);

      dispatch(createNewDesignation(formData))
        .then((result) => {
          if (result.payload.SUCCESS === 1) {
            setAlert({
              open: true,
              severity: 'success',
              message: result.payload.USER_MESSAGE,
            });

            if (!edit) {
              setItemAdded((prev) => prev + 1);
              setDesignations((prev) => [...prev, { id: result.payload.id, label: values.label }]);
              if (designation?.label) {
                handleClose();
              }
            } else {
              setItemAdded((prev) => prev + 1);
            }
            setLoading(false);
            setAddDesignation(false);
            resetForm();
          } else {
            setLoading(false);
            setAlert({
              open: true,
              severity: 'error',
              message: result.payload,
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          setAlert({
            open: true,
            severity: 'error',
            message: err.USER_MESSAGE || 'Something went wrong.',
          });
        });
    },
  });

  useEffect(() => {
    if (designation?.label) {
      formik.setValues({
        label: designation.label,
        firmId: firmId,
        id: designation.id,
      });
    }
  }, [designation]);

  return (
    <Dialog open onClose={handleClose} fullWidth maxWidth={'xs'}>
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <Stack>
        <DialogTitle id="alert-dialog-title" variant="h4" sx={{ color: 'primary.main' }}>
          {designation?.label ? 'Edit designation' : 'Add new designation'}
        </DialogTitle>
      </Stack>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box pb={'3rem'}>
            <Box className="flex">
              <CustomFormLabel htmlFor="label" sx={{ mt: '0' }}>
                Designation
              </CustomFormLabel>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CustomTextField
                fullWidth
                id="label"
                name="label"
                variant="outlined"
                sx={{ flex: '1' }}
                type="text"
                value={formik.values.label}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.label && Boolean(formik.errors.label)}
                helperText={formik.touched.label && formik.errors.label}
              />
            </Box>
          </Box>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Button
              onClick={() => setAddDesignation(false)}
              variant="outlined"
              sx={{
                mr: 1,
                color: 'primary.main !important',
                bgcolor: '#fff !important',
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" sx={{ ml: 1 }}>
              {loading ? (
                <IconLoader2 className="animate-spin text-white" />
              ) : designation?.label ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </Stack>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddDesignation;
