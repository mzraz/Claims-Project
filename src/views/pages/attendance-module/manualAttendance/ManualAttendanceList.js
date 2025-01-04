import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Button,
  ClickAwayListener,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Spinner from '../../../spinner/Spinner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import {
  IconDotsVertical,
  IconFilter,
  IconSearch,
  IconTrash,
  IconCalendarStats,
} from '@tabler/icons';
import AlertMessage from '../../../../components/shared/AlertMessage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router';
import {
  getAllAttendances,
  deleteEmployeeAttendance,
} from '../../../../store/attendance/AttendanceSlice';
import dayjs from 'dayjs';
import AttendanceDetail from './AttendanceDetail';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import { id } from 'date-fns/locale';
import { IconLoader2 } from '@tabler/icons';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Edit } from '@mui/icons-material';
import CreateAttendanceModal from './CreateAttendanceModal';
import UpdateAttendanceModal from './UpdateAttendanceModal';
import DeleteAttendanceModal from './DeleteAttendanceModal';
import FullscreenDialog from '../../../../components/material-ui/dialog/FullscreenDialog';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'employeeName',
    numeric: false,
    disablePadding: false,
    label: 'Employee Name',
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'scheduled',
    numeric: false,
    disablePadding: false,
    label: 'Scheduled',
  },

  {
    id: 'checkIn',
    numeric: false,
    disablePadding: false,
    label: 'Check In/ Checkout',
  },

  {
    id: 'checkOut',
    numeric: false,
    disablePadding: false,
    label: 'Total worked',
  },
  {
    id: 'difference',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
  // {
  //   id: 'difference',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Action',
  // },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            sx={{ fontSize: '13px', fontWeight: '500', opacity: 0.7, p: 1, pl: 3 }}
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    handleSearch,
    search,
    date,
    setDate,
    title,
    addBtn,
    setSearchTrigger,
    handleCreateModalOpen,
  } = props;

  const [open, setOpen] = React.useState(false);
  const handleToday = () => {
    const today = dayjs();
    setDate({ from: today, to: today });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleThisMonth = () => {
    const from = dayjs().startOf('month');
    const to = dayjs().endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handlePreviousMonth = () => {
    const from = dayjs().subtract(1, 'month').startOf('month');
    const to = dayjs().subtract(1, 'month').endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handlePreviousThreeMonths = () => {
    const from = dayjs().subtract(3, 'months').startOf('month');
    const to = dayjs().subtract(1, 'month').endOf('month');
    setDate({ from: from, to: to });
    setOpen(false);
    setSearchTrigger((prev) => prev + 1);
  };

  const handleDateSearch = () => {
    if (date.from && date.to) {
      setSearchTrigger((prev) => prev + 1);
      setOpen(false);
    }
  };
  const handleClick = (event) => {
    setOpen(!open);
  };
  const handleClear = () => {
    setDate({
      to: '',
      from: '',
    });
    setOpen(false);
  };
  return (
    <Toolbar
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box className="relative">
            <Button
              onClick={handleClick}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 0.7,
                cursor: 'pointer',
                bgcolor: '#fff !important',
              }}
            >
              <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
              <Typography
                variant="h5"
                sx={{ whiteSpace: 'nowrap', cursor: 'pointer', color: 'primary.main' }}
              >
                {date.from === '' || date.to === ''
                  ? 'Select date'
                  : `${date.from.format('DD MMMM YYYY')} - ${date.to.format('DD MMMM YYYY')}`}
              </Typography>
              <ArrowDropDownIcon
                sx={{ color: 'primary.main' }}
                className={`transition-transform ${!open ? 'rotate-180 ' : ''}`}
              />
            </Button>
            {open && (
              <Box className="absolute top-full left-0 z-[1000] w-[26rem] py-3  px-3 gap-4 bg-white drop-shadow-lg flex items-center flex-col justify-center">
                <Typography
                  color={'primary.main'}
                  onClick={handleClear}
                  className="self-end cursor-pointer"
                >
                  Clear
                </Typography>
                <Box className="flex items-end gap-2">
                  <Box>
                    <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                      From:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        value={date.from ? dayjs(date.from, 'DD/MM/YYYY') : null}
                        onChange={(newValue) => {
                          setDate((prev) => ({ ...prev, from: newValue }));
                        }}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            sx={{
                              svg: { color: 'primary.main', fontSize: '1.5rem', p: 0 },
                              input: { color: '' },

                              '& .MuiInputBase-root': {
                                outline: 'none',
                                flexDirection: 'row-reverse',
                              },

                              '& .MuiOutlinedInput-notchedOutline': {},
                              // '& .MuiPickersDay-dayWithMargin': {
                              //   color: 'green',
                              // },
                            }}
                            size="small"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box>
                    <Typography fontSize={'.8rem'} className="self-start text-gray-500">
                      To:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        inputFormat="DD/MM/YYYY"
                        value={date.to ? dayjs(date.to, 'DD/MM/YYYY') : null}
                        onChange={(newValue) => {
                          setDate((prev) => ({ ...prev, to: newValue }));
                        }}
                        minDate={dayjs(date.from, 'DD/MM/YYYY').subtract(1, 'day')}
                        renderInput={(params) => (
                          <CustomTextField
                            {...params}
                            sx={{
                              svg: { color: 'primary.main', fontSize: '1.5rem' },
                              input: { color: '' },

                              '& .MuiInputBase-root': {
                                outline: 'none',
                                flexDirection: 'row-reverse',
                              },

                              '& .MuiOutlinedInput-notchedOutline': {},
                              // '& .MuiPickersDay-dayWithMargin': {
                              //   color: 'green',
                              // },
                            }}
                            size="small"
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Box>
                  <IconButton onClick={handleDateSearch}>
                    <ManageSearchIcon sx={{ color: 'primary.main' }} />
                  </IconButton>
                </Box>
                <Button
                  onClick={handleToday}
                  sx={{
                    width: '100%',
                    color: 'primary.main',
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: '#fff !important',
                    '&:hover': {
                      backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                      color: 'white',
                    },
                  }}
                >
                  Today
                </Button>
                <Button
                  onClick={handleThisMonth}
                  sx={{
                    width: '100%',
                    color: 'primary.main',
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: '#fff !important',
                    '&:hover': {
                      backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                      color: 'white',
                    },
                  }}
                >
                  This Month
                </Button>

                <Button
                  onClick={handlePreviousMonth}
                  sx={{
                    width: '100%',
                    color: 'primary.main',
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: '#fff !important',
                    '&:hover': {
                      backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                      color: 'white',
                    },
                  }}
                >
                  Last Month
                </Button>

                <Button
                  onClick={handlePreviousThreeMonths}
                  sx={{
                    width: '100%',
                    color: 'primary.main',
                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                    bgcolor: '#fff !important',
                    '&:hover': {
                      backgroundColor: (theme) => `${theme.palette.primary.main} !important`,
                      color: 'white',
                    },
                  }}
                >
                  Last 3 Months
                </Button>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Stack>
      <Box>
        <Paper
          elevation={0}
          sx={{ borderRadius: '', display: 'flex', alignItems: 'center', gap: 3 }}
        >
          <TextField
            color="primary"
            sx={{
              minWidth: '200px',
              '& .MuiInputBase-root': {
                border: 'none !important',
                // borderRadius: '30px !important'
              },
              '& .MuiOutlinedInput-input': {
                pl: 0,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                // border: 'none',
              },
            }}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch color="gray" size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="Search by name, id"
            size="small"
            onChange={handleSearch}
            value={search}
          />

          <Button
            onClick={handleCreateModalOpen}
            variant="outlined"
            sx={{ width: '100%', px: 1, pr: 2, color: 'white' }}
          >
            <AddIcon fontSize="small" sx={{ mr: 1 }} /> Add New Attendance
          </Button>
        </Paper>
      </Box>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    borderBottom: '1px solid #e5eaef',
  },
}));

const ManualAttendanceList = () => {
  const firmId = JSON.parse(localStorage.getItem('AutoBeatXData'))?.firmId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [toggle, setToggle] = React.useState(false);
  const [alert, setAlert] = React.useState({});

  const [rows, setRows] = React.useState([]);
  const [allRows, setAllRows] = React.useState([]);
  const [changes, setChanges] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month'),
  });
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [employeeId, setEmployeeId] = React.useState(null);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [updateModalOpen, setUpdateModalOpen] = React.useState(false);
  const [selectedAttendance, setSelectedAttendance] = React.useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = React.useState(null);

  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  const handleUpdateModalOpen = (attendanceData) => {
    setSelectedAttendance(attendanceData);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setTimeout(() => {
      setSelectedAttendance({});
    }, 200);
  };

  const openEmployeeDetailModal = (id) => {
    setEmployeeId(id);
    setOpen(true);
  };

  //Fetch Products
  React.useEffect(() => {
    if (!date.to || !date.from) return;
    setLoading(true);

    const formdata = new FormData();
    formdata.append('companyId', firmId);
    formdata.append('startDate', dayjs(date.from).format('YYYY-MM-DD'));
    formdata.append('endDate', date.to.format('YYYY-MM-DD'));

    dispatch(getAllAttendances(formdata))
      .then((result) => {
        console.log(result, 'result');

        if (result.payload.SUCCESS === 1) {
          const formattedData = result.payload.DATA.map((item) => ({
            id: item.id,
            employeeName: item.employeeName,
            employeeId: item.employeeId,
            date: dayjs(item.date, 'DD/MM/YYYY').format('ddd D MMM, YYYY'), // Assuming current date, adjust as needed
            status: item.status,
            scheduled: `${item.shiftStartTime} - ${item.shiftEndTime}`,
            checkIn: item.checkInTime || '-',
            checkOut: item.checkOutTime || '-',
            checkInStatus: item.checkInStatus,
            checkOutStatus: item.checkOutStatus,
            totalWorked: item.totalWorked || '-',
            totalWorkedStatus: item.totalWorkedStatus,
            shiftLabel: item.shiftLabel || '-',
            shiftTotalHours: item.shiftTotalHours,
            employeeDesignationLabel: item.employeeDesignationLabel,
            employeeNo: item.employeeNo,
            profileFileName: item.profileFileName,
            attendanceId: item.attendenceId,
          }));
          setRows(formattedData);
          setAllRows(formattedData);
          setLoading(false);
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
        setLoading(false);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Something went wrong.',
        });
      });
  }, [changes]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);

    let filteredRows = [...allRows];

    if (searchTerm.trim() !== '') {
      filteredRows = allRows.filter((row) =>
        Object.values(row).some(
          (value) => value && value.toString().toLowerCase().includes(searchTerm),
        ),
      );
    }
    setPage(0);
    setRows(filteredRows);
  };

  // const handleDeleteAttendance = (attendanceId) => {
  //   const formData = new FormData();
  //   formData.append('attendenceId', attendanceId);

  //   dispatch(deleteEmployeeAttendance(formData))
  //     .then((result) => {
  //       if (result.payload.SUCCESS === 1) {
  //         setChanges(prev => prev + 1);
  //         // Show success message
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       // Show error message
  //     });
  // };
  const handleDeleteAttendance = (attendanceId) => {
    setAttendanceToDelete(attendanceId);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.append('attendenceId', attendanceToDelete);

    dispatch(deleteEmployeeAttendance(formData))
      .then((result) => {
        if (result.payload.SUCCESS === 1) {
          setChanges((prev) => prev + 1);
          setAlert({
            open: true,
            severity: 'success',
            message: 'Attendance deleted successfully',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlert({
          open: true,
          severity: 'error',
          message: err.USER_MESSAGE || 'Failed to delete attendance',
        });
      })
      .finally(() => {
        setConfirmModalOpen(false);
        setAttendanceToDelete(null);
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function getBackgroundColor(status) {
    switch (status) {
      case 'Absent':
        return 'bg-red-200 text-[red]';
      case 'Present':
        return 'bg-green-200 text-[green]';
      case 'Day Off':
        return 'bg-[#e3efff] text-[#0197f6]';
      case 'Public Holiday':
        return 'bg-[#ececf9] text-[purple]';
      case 'On Paid Leave':
        return 'bg-[#fff4e5] text-[#e65100]'; // Light orange background with darker orange text
      case 'On Unpaid Leave':
        return 'bg-[#e8eaf6] text-[#3f51b5]'; // Light indigo background with dark indigo text
      default:
        // Handle unexpected status values (optional)
        console.warn(`Unknown status: ${status}`);
        return 'bg-gray-200'; // Or any default color
    }
  }

  const BCrumb = [
    {
      to: '/attendance',
      title: 'Attendance',
    },
    {
      title: 'Attendance List',
    },
  ];
  return (
    <Box>
      <Breadcrumb title="Employee Wise Attendance" items={BCrumb} />
      <AlertMessage
        open={alert.open}
        setAlert={setAlert}
        severity={alert.severity}
        message={alert.message}
      />
      <CreateAttendanceModal
        open={createModalOpen}
        handleClose={handleCreateModalClose}
        setAlert={setAlert}
        companyId={firmId}
        setChanges={setChanges}
      />

      <UpdateAttendanceModal
        open={updateModalOpen}
        handleClose={handleUpdateModalClose}
        attendanceData={selectedAttendance}
        setAlert={setAlert}
        companyId={firmId}
        setChanges={setChanges}
      />

      <DeleteAttendanceModal
        open={confirmModalOpen}
        handleClose={() => setConfirmModalOpen(false)}
        handleConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this attendance record? This action cannot be undone."
      />

      {/* <Box mt={3} pl={2}>
        <Button onClick={() => { navigate(-1) }} variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important', display: 'flex', alignItems: 'center', py: 1 }} size="small">
          <ArrowBackIosNewIcon sx={{ color: 'primary.main', fontSize: '.8rem' }} />
          <Typography variant='h6' fontWeight={600} pl={2} pr={3} textAlign={'center'}>Back</Typography>
        </Button >
      </Box> */}
      {open && (
        <FullscreenDialog open={open} setOpen={setOpen} title="Employee Attendance Details">
          <AttendanceDetail id={employeeId} initialDate={date} />
        </FullscreenDialog>
      )}

      <Box>
        <EnhancedTableToolbar
          setSearchTrigger={setChanges}
          title={'Employees Attendance List'}
          handleCreateModalOpen={handleCreateModalOpen}
          numSelected={selected.length}
          search={search}
          handleSearch={handleSearch}
          date={date}
          setDate={setDate}
        />
        <Paper variant="outlined">
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box color={'primary.main'} className="text-center flex justify-center">
                        <div className="animate-spin">
                          <IconLoader2 size={30} />
                        </div>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <StyledTableRow key={`${row.id}-${row.employeeName}-${index}`}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              alt={''}
                              src={
                                `https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${row.profileFileName}` ||
                                'https://as2.ftcdn.net/v2/jpg/03/49/49/79/1000_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg'
                              }
                              sx={{ width: '35px', height: '35px' }}
                            />
                            <Box>
                              <Typography
                                fontWeight={600}
                                sx={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {row.employeeName}
                              </Typography>
                              <Typography fontSize={10} color={'grey'}>
                                {row.employeeNo}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{row.date}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            className={`px-1 rounded-md text-center ${getBackgroundColor(
                              row.status,
                            )}`}
                          >
                            {row.status || 'Absent'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            fontSize={12}
                            className={`rounded-md border-l-[1rem] ${
                              row.shiftLabel !== '-' ? 'border-purple-200' : 'border-yellow-200'
                            } bg-gray-100 px-3 py-1 w-[11rem] '`}
                          >
                            <Typography fontSize={12} fontWeight={600}>
                              {row.shiftLabel !== '-' ? row.scheduled : 'No shift Assigned.'}
                            </Typography>
                            <Box
                              className="flex items-center justify-between w-full text-zinc-400"
                              fontSize={11}
                            >
                              <Typography fontSize={11} className="flex items-center gap-1">
                                <AccessTimeIcon sx={{ fontSize: '.8rem' }} />
                                {row.shiftTotalHours}
                              </Typography>
                              {
                                <Typography
                                  fontSize={11}
                                  className={`flex items-center gap-1 ${
                                    row.shiftLabel !== '-' ? '' : 'opacity-0'
                                  }`}
                                >
                                  Shift:
                                  <Tooltip title={row.shiftLabel}>
                                    <span className="bg-purple-200 w-4 h-4 rounded-full flex items-center justify-center text-[.6rem] text-black font-bold">
                                      {row.shiftLabel?.charAt(0)}
                                    </span>
                                  </Tooltip>
                                </Typography>
                              }
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            className={`grid ${
                              row.checkIn !== '-' && row.shiftLabel !== '-'
                                ? 'grid-cols-2'
                                : 'text-center'
                            } gap-1 mb-1`}
                          >
                            <Typography className="tabular-nums">{row.checkIn}</Typography>
                            {row.checkIn !== '-' && (
                              <Typography
                                className={`px-1 rounded-md text-center ${
                                  row.checkInStatus === 'Timely In'
                                    ? 'bg-green-200 text-[green]'
                                    : 'bg-red-200 text-[red]'
                                }`}
                              >
                                {row.checkInStatus}
                              </Typography>
                            )}
                          </Box>
                          <Box
                            className={`grid ${
                              row.checkOut !== '-' && row.shiftLabel !== '-'
                                ? 'grid-cols-2'
                                : 'text-center'
                            } gap-1`}
                          >
                            <Typography className="tabular-nums">{row.checkOut}</Typography>
                            {row.checkOut !== '-' && (
                              <Typography
                                className={`px-1 rounded-md text-center ${
                                  row.checkOutStatus === 'Timely Out'
                                    ? 'bg-green-200 text-[green]'
                                    : 'bg-red-200 text-[red]'
                                }`}
                              >
                                {row.checkOutStatus}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className={`flex flex-col pl-5`}>
                            <Typography
                              className={`${row.totalWorked !== '-' ? 'text-blue-600' : ''}`}
                            >
                              {row.totalWorked}
                            </Typography>
                            <Typography
                              fontSize={11}
                              className={`${
                                row.totalWorkedStatus?.startsWith('+')
                                  ? 'text-green-600'
                                  : row.totalWorkedStatus?.startsWith('-')
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {row.totalWorkedStatus}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className={`flex items-center gap-1`}>
                            <IconButton
                              sx={{ color: 'primary.main' }}
                              onClick={() => openEmployeeDetailModal(row.id)}
                            >
                              <IconCalendarStats className=" cursor-pointer" fontSize="small" />
                            </IconButton>
                            {row.attendanceId && (
                              <IconButton
                                sx={{ color: 'primary.main' }}
                                onClick={() => handleUpdateModalOpen(row)}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            )}
                            {row.attendanceId && (
                              <IconButton
                                sx={{ color: '#FA896B' }}
                                onClick={() => handleDeleteAttendance(row.attendanceId)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ManualAttendanceList;
