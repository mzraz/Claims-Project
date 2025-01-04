import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, CardActions, CardContent } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router';
import SelectedEmployees from './addbySearch/SelectedEmployees';
import BasicInfo from './addManually/BasicInfo';
import BankDetails from './addManually/BankDetails';
import RoleAndStatus from './addManually/RoleAndStatus';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  addSelectedCandidates,
  setSelectedCandidate,
} from '../../../store/candidates/CandidatesSlice';
import { addNewEmployee } from '../../../store/hr/EmployeeSlice';
import { useDispatch, useSelector } from 'react-redux';
import AvailableEmployees from './addbySearch/AvailableEmployees';
import AlertMessage from '../../../components/shared/AlertMessage';
import RosterData from './addManually/RosterData';
import { CalculateSharp } from '@mui/icons-material';
import dayjs from 'dayjs';
import CustomBackdrop from '../../../components/forms/theme-elements/CustomBackdrop';
import { updateProfileImageByUser } from '../../../store/auth/userProfile/ProfileSlice';

export default function MultistepForm() {
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;
  const { user } = useSelector((state) => state.loginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading } = useSelector((state) => state.employeeReducer);
  const [steps, setSteps] = React.useState([]);
  const [activeStep, setActiveStep] = React.useState(0);
  const [avatarData, setAvatarData] = React.useState({
    preview: null,
    file: null,
  });
  const [skipped, setSkipped] = React.useState(new Set());
  const [selected, setSelected] = React.useState([]);
  const [toggle, setToggle] = React.useState(false);
  const [alert, setAlert] = React.useState({
    open: false,
    severity: '',
    message: '',
  });

  const validationSchema = [
    yup.object({
      firstName: yup.string().when([], () => {
        if (activeStep === 0 && location?.state?.type === 2) {
          return yup
            .string()
            .required('First Name is Required')
            .test('trim', 'First Name cannot have leading or trailing spaces', (value) => {
              if (value) {
                return value.trim() === value; // Check if trimmed value is same as original value
              }
              return true; // Allow empty value
            })
            .test(
              'no-extra-spaces',
              'First Name cannot have more than one space between characters',
              (value) => {
                if (value) {
                  return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
                }
                return true; // Allow empty value
              },
            )
            .min(2, 'Too Short!')
            .max(20, 'Too Long!');
        }
      }),
      hourlyRate: yup.number().when([], () => {
        if (activeStep === 0 && location?.state?.type === 2) {
          return yup.number().required('Hourly rate is required');
        }
      }),
      lastName: yup.string().when([], () => {
        if (activeStep === 0 && location?.state?.type === 2) {
          return yup
            .string()
            .test('trim', 'Last Name cannot have leading or trailing spaces', (value) => {
              if (value) {
                return value.trim() === value; // Check if trimmed value is same as original value
              }
              return true; // Allow empty value
            })
            .test(
              'no-extra-spaces',
              'Last Name cannot have more than one space between characters',
              (value) => {
                if (value) {
                  return !/\s{2,}/.test(value); // Check if there are no more than one space between characters
                }
                return true; // Allow empty value
              },
            )
            .min(2, 'Too Short!')
            .max(20, 'Too Long!');
        }
      }),
      email: yup.string().when([], () => {
        if (activeStep === 0 && location?.state?.type === 2) {
          return yup
            .string('Enter your email')
            .email('Enter a valid email')
            .required('Email is required');
        }
      }),
      contactNo: yup.string().when([], () => {
        if (activeStep === 0 && location?.state?.type === 2) {
          return yup
            .string()
            .required('Contact number is Required')
            .min(7, 'Too Short!')
            .max(15, 'Too Long!');
        }
      }),
      // password: yup.string()
      //     .when([], () => {
      //         if (activeStep === 0 && location?.state?.type === 2) {
      //             return yup.string('Enter your password')
      //                 .min(8, 'Password should be of minimum 8 characters length')
      //                 .matches(
      //                     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //                     'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      //                 )
      //                 .required('Password is required')
      //         }
      //     }),
      // confirmPassword: yup.string()
      //     .when([], () => {
      //         if (activeStep === 0 && location?.state?.type === 2) {
      //             return yup.string().when('password', {
      //                 is: (val) => (val && val.length > 0 ? true : false),
      //                 then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same').required('Confirm password is required')
      //             })
      //         }
      //     })
    }),
    yup.object({
      // cnicNo: yup.string()
      //     .when([], () => {
      //         if (activeStep === 1 && location?.state?.type === 2) {
      //             return yup.string().min(5, 'Too Short!').max(20, 'Too Long!');
      //         }
      //     }),
      // nationality: yup.string()
      //     .when([], () => {
      //         if (activeStep === 1 && location?.state?.type === 2) {
      //             return yup.string().required('Nationality is Required');
      //         }
      //     }),
      bankAccountNo: yup.string().when([], () => {
        if (activeStep === 1 && location?.state?.type === 2) {
          return yup.string();
        }
      }),
    }),
    // yup.object({
    //     hourlyRate: yup.number()
    //         .when([], () => {
    //             if (activeStep === 3 && location?.state?.type === 2) {
    //                 return yup.number().required('Hourly rate is required');
    //             }
    //         }),
    //     startOnDate: yup.string()
    //         .when([], () => {
    //             if (activeStep === 3 && location?.state?.type === 2) {
    //                 return yup.string().typeError("Please enter a start date.").required("Start date is Required");
    //             }
    //         }),
    //     endOnDate: yup.string()
    //         .when([], () => {
    //             if (activeStep === 3 && location?.state?.type === 2) {
    //                 return yup.string().typeError("Please enter an end date.").required("End date is Required.");
    //             }
    //         }),
    //     selectedWeeks: yup.array()
    //         .when([], () => {
    //             if (activeStep === 3 && location?.state?.type === 2) {
    //                 return yup.array().min(1, 'At least one week must be selected').required('Please select at least one week');
    //             }
    //         }),
    //     selectedMonth: yup.object()
    //         .when([], () => {
    //             if (activeStep === 3 && location?.state?.type === 2) {
    //                 return yup.object().required('Please select a month');
    //             }
    //         })
    // })
  ];

  const currentValidationSchema = validationSchema[activeStep];

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      nickName: '',
      email: '',
      contactNo: '',
      cnicNo: '',
      countryId: null,
      bankAccountNo: '',
      departmentId: '',
      designationId: '',
      hourlyRate: '',
      companyId: firmId,
    },
    validationSchema: currentValidationSchema,
    onSubmit: (values, actions) => {
      //Step validations are in the below function
      handleNext(actions);

      //this onSubmit method is called on handleNext function.

      //If addmanually form is completed, submit data.
      if (activeStep === steps.length - 1 && location?.state?.type === 2) {
        submitForm(values);
      }
    },
  });

  const submitForm = (values) => {
    const data = {
      companyId: values.companyId,
      firstName: values.firstName,
      lastName: values.lastName,
      displayName: `${values.firstName} ${values.lastName}`,
      nickName: values.nickName,
      email: values.email,
      contactNo: values.contactNo,
      originOfPassportId: values.countryId?.id || 0,
      cnicNo: values.cnicNo,
      bankAccount: values.bankAccountNo,
      departmentId: values.departmentId || 0,
      designationId: values.designationId || 0,
      hourlyRate: values.hourlyRate,
      userId: 0,
      isActive: 1,
      // startDate: dayjs(values.startOnDate).format('YYYY-MM-DD'),
      // endDate: dayjs(values.endOnDate).format('YYYY-MM-DD'),
      // yearId: values.selectedMonth.YearId,
      // monthId: values.selectedMonth.monthId,
      // isManualAttendence: values.checked ? 1 : 0,
      // commonDateIds: values.selectedWeeks.map(item => item.dates.map(a => a.dateId)).flat(),
      // dayIds: Object.entries(values.schedule).filter(([day, { isActive }]) => isActive).map(([day, { id }]) => id),
      // weekLabels: values.selectedWeeks.map(item => item.label),
      // timeIns: Object.entries(values.schedule)
      //     .filter(([day, { isActive }]) => isActive)
      //     .map(([day, { timeIn }]) => dayjs(timeIn).format('HH:mm')),
      // timeOuts: Object.entries(values.schedule)
      //     .filter(([day, { isActive }]) => isActive)
      //     .map(([day, { timeOut }]) => dayjs(timeOut).format('HH:mm')),
      // breakTimes: Object.entries(values.schedule)
      //     .filter(([day, { isActive }]) => isActive)
      //     .map(([day, { breakTime }]) => dayjs(breakTime).format('HH:mm')),
    };
    let formdata = new FormData();
    let formDataImg = new FormData();

    formDataImg.append('file', avatarData.file);
    formDataImg.append('userId', 0);

    for (const key in data) {
      formdata.append(key, data[key]);
    }

    dispatch(updateProfileImageByUser(formDataImg))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          // setAlert({
          //   open: true,
          //   severity: 'success',
          //   message: result.payload.USER_MESSAGE
          // })
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
    dispatch(addNewEmployee(formdata))
      .then((result) => {
        console.log(result, 'result');
        if (result.payload.SUCCESS === 1) {
          setAlert({
            open: true,
            severity: 'success',
            message: 'Candidate has been added successfully',
          });
          if (user.isCompanyProfileCompleted) {
            setTimeout(() => {
              navigate(`/hr/view-employees`);
            }, 500);
          } else {
            setTimeout(() => {
              navigate(`/admin/addEmployees/${firmId}`);
            }, 500);
          }
        } else {
          setAlert({
            open: true,
            severity: 'error',
            message: result.payload,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Couldnt add employee. Please try again.',
        });
      });
  };

  const isStepOptional = (step) => {
    return location?.state?.type === 2 && step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleBack = () => {
    if (activeStep === 0) {
      navigate(-1);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  /*
    Most important part of this component, it is responsible for stepping. This Multistep form Component handles 2 components, which are two stepper forms.
    one is add employee from website workflow, the other is add manually workflow. This function steps both of these components, checks
    formik errors manually to avoid premature error handling. 
    */
  const handleNext = (actions) => {
    //steps for add from website workflow
    if (location?.state?.type === 1 && activeStep === 0 && selected.length === 0) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Please select atleast one candidate.',
      });
    }
    if (location?.state?.type === 1 && activeStep === 0 && selected.length !== 0) {
      dispatch(setSelectedCandidate({}));
      dispatch(addSelectedCandidates(selected));
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    } else if (location?.state?.type === 1 && activeStep === 1) {
      setAlert({
        open: true,
        severity: 'success',
        message: 'Candidates have been added successfully',
      });
      setTimeout(() => {
        navigate(`/admin/addEmployees/${firmId}`);
      }, 3000);
    }
    //steps for add manually workflow
    if (location?.state?.type === 2 && activeStep !== steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  };

  // const handleNext = () => {
  //     if (activeStep !== steps.length - 1) {
  //         let newSkipped = skipped;
  //         if (isStepSkipped(activeStep)) {
  //             newSkipped = new Set(newSkipped.values());
  //             newSkipped.delete(activeStep);
  //         }

  //         setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //         setSkipped(newSkipped);
  //     }
  // };

  React.useEffect(() => {
    if (location?.state?.type === 1) {
      setSteps((prevState) => [...prevState, 'Search Candidates', 'Add Candidates']);
    } else if (location?.state?.type === 2) {
      setSteps((prevState) => [
        ...prevState,
        'Candidate Info',
        'ID & Bank Details',
        'Department & Designation',
      ]);
    }
  }, []);

  return (
    <Box sx={{ width: '100%', mt: 5 }}>
      <CustomBackdrop loading={loading} />
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <form onSubmit={formik.handleSubmit}>
        <Card elevation={9} sx={{ p: 2, minHeight: '500px' }}>
          <CardContent sx={{ minHeight: '470px' }}>
            <Stepper activeStep={activeStep} sx={{ px: 10 }}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                if (isStepSkipped(index)) {
                  stepProps.completed = false;
                }
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>

            <Box>
              {location?.state?.type === 1 &&
                (activeStep === 0 ? (
                  <AvailableEmployees
                    toggle={toggle}
                    setToggle={setToggle}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ) : (
                  <SelectedEmployees
                    showToolbar={true}
                    title={'Are you sure you want to add these candidates?'}
                  />
                ))}

              {location?.state?.type === 2 &&
                (activeStep === 0 ? (
                  <BasicInfo
                    formik={formik}
                    avatarData={avatarData}
                    setAvatarData={setAvatarData}
                  />
                ) : activeStep === 1 ? (
                  <BankDetails formik={formik} />
                ) : activeStep === 2 ? (
                  <RoleAndStatus formik={formik} firmId={firmId} />
                ) : (
                  <RosterData formik={formik} />
                ))}
            </Box>
          </CardContent>
          <CardActions
            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <React.Fragment>
              <Button
                variant="outlined"
                // disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {isStepOptional(activeStep) && (
                <Button
                  variant="outlined"
                  onClick={handleSkip}
                  sx={{ mr: 1, color: 'primary.main', bgcolor: '#fff !important' }}
                >
                  Skip
                </Button>
              )}

              <Button type="submit" variant="contained">
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </React.Fragment>
          </CardActions>
        </Card>
      </form>
    </Box>
  );
}
