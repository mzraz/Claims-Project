import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomFormLabel from '../../../../components/forms/theme-elements/CustomFormLabel';
import { getDepartmantsByFirm, getDesignationsByFirm } from '../../../../store/hr/EmployeeSlice';
import AddDesignation from './AddDesignationModal';
import { AddDepartment } from './AddDepartmentModal';

const RoleAndStatus = ({ formik, firmId }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.employeeReducer);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [addDesignation, setAddDesignation] = useState(false);
  const [addDepartment, setAddDepartment] = useState(false);
  const [itemAdded, setItemAdded] = useState(0);

  useEffect(() => {
    let formData = new FormData();
    formData.append('firmId', firmId);

    // Fetch departments
    dispatch(getDepartmantsByFirm(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setDepartments(result.payload.DATA);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    // Fetch designations
    dispatch(getDesignationsByFirm(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setDesignations(result.payload.DATA);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [itemAdded]);

  return (
    <>
      <Stack direction={'row'} spacing={3}>
        <Box sx={{ width: '100%' }}>
          <Box className="flex items-center justify-between gap-3">
            <CustomFormLabel htmlFor="departmentId">Department</CustomFormLabel>
            <Typography
              onClick={() => setAddDepartment(true)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
                px: '.4rem',
                minWidth: 'auto',
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Add
            </Typography>
          </Box>

          <Select
            id="departmentId"
            name="departmentId"
            value={formik.values.departmentId}
            onChange={formik.handleChange}
            error={formik.touched.departmentId && Boolean(formik.errors.departmentId)}
            fullWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              <em>Select...</em>
            </MenuItem>
            {departments?.map((obj) => (
              <MenuItem key={obj.id} value={obj.id}>
                {obj.label}
              </MenuItem>
            ))}
          </Select>
          <span style={{ color: '#FA896B', fontSize: '0.75rem' }}>
            {formik.touched.departmentId && formik.errors.departmentId}
          </span>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Box className="flex items-center justify-between gap-3">
            <CustomFormLabel htmlFor="designationId">Designation</CustomFormLabel>
            <Typography
              onClick={() => setAddDesignation(true)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
                px: '.4rem',
                minWidth: 'auto',
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              + Add
            </Typography>
          </Box>

          <Select
            id="designationId"
            name="designationId"
            value={formik.values.designationId}
            onChange={formik.handleChange}
            error={formik.touched.designationId && Boolean(formik.errors.designationId)}
            fullWidth
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>
              <em>Select...</em>
            </MenuItem>
            {designations?.map((obj) => (
              <MenuItem key={obj.id} value={obj.id}>
                {obj.label}
              </MenuItem>
            ))}
          </Select>
          <span style={{ color: '#FA896B', fontSize: '0.75rem' }}>
            {formik.touched.designationId && formik.errors.designationId}
          </span>
        </Box>
      </Stack>

      <Stack direction="row" spacing={3} justifyContent={'center'} mt={13} />

      {addDesignation && (
        <AddDesignation
          firmId={firmId}
          setAddDesignation={setAddDesignation}
          setDesignations={setDesignations}
          handleClose={() => setAddDesignation(false)}
          setItemAdded={setItemAdded}
        />
      )}

      {addDepartment && (
        <AddDepartment
          firmId={firmId}
          setAddDepartment={setAddDepartment}
          setDepartments={setDepartments}
          handleClose={() => setAddDepartment(false)}
          setItemAdded={setItemAdded}
        />
      )}
    </>
  );
};

export default RoleAndStatus;
