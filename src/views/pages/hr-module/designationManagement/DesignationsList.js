import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import { format } from 'date-fns';
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
    Chip,
} from '@mui/material';

import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash, IconLoader2 } from '@tabler/icons';
import AlertMessage from '../../../../components/shared/AlertMessage';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import { getAllDesignations, deleteDesignationById } from '../../../../store/hr/DesignationSlice';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { AddDesignation } from '../../multistep-form/addManually/RoleAndStatus';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import Breadcrumb from '../../../../layouts/full/shared/breadcrumb/Breadcrumb';

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
        id: 'designationId',
        numeric: false,
        disablePadding: false,
        label: 'Designation Id',
    },
    {
        id: 'designationName',
        numeric: false,
        disablePadding: false,
        label: 'Designation Name',
    },
    {
        id: 'employees',
        numeric: false,
        disablePadding: false,
        label: 'Employees',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'Action',
    }
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
                        sx={{ fontSize: '13px', fontWeight: '500', opacity: .7, whiteSpace: 'nowrap' }}
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
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

const EnhancedTableToolbar = (props) => {
    const { numSelected, handleSearch, search } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            <Box sx={{ flex: '1 1 100%' }}>
                <TextField
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconSearch size="1.1rem" />
                            </InputAdornment>
                        ),
                    }}
                    placeholder="Search Designation"
                    size="small"
                    onChange={handleSearch}
                    value={search}
                />
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
        border: 0,
    },
}));

const DesignationsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [alert, setAlert] = React.useState({
        open: false,
        severity: '',
        message: ''
    });
    const [openModal, setOpenModal] = React.useState(false);
    const [editDesignation, setEditDesignation] = React.useState(null);
    const [changes, setChanges] = React.useState(0)

    const [data, setData] = React.useState([])
    const [rows, setRows] = React.useState([]);
    const [search, setSearch] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true)
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [designationToDelete, setDesignationToDelete] = React.useState(null);


    //Fetch Products
    React.useEffect(() => {
        const localData = JSON.parse(localStorage.getItem('AutoBeatXData'))

        dispatch(getAllDesignations(localData.firmId))
            .then((result) => {
                console.log(result, "result")

                if (result.payload.SUCCESS === 1) {
                    setData(result.payload.DATA)
                    setRows(result.payload.DATA)
                }
                else {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: result.payload
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                setAlert({
                    open: true,
                    severity: 'error',
                    message: err.USER_MESSAGE || 'Something went wrong.'
                })
            }).finally((s) => {
                setIsLoading(false)
            })
    }, [changes]);


    const handleSearch = (event) => {
        const filteredRows = data.filter((row) => {
            return row.id?.toString().toLowerCase().includes(event.target.value) ||
                row.label?.toLowerCase().includes(event.target.value) ||
                row.designation?.toLowerCase().includes(event.target.value);
        });
        setSearch(event.target.value);
        setRows(filteredRows);
        setPage(0)
    };

    // This is for the sorting
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
    const handleEditDesignation = (designation) => {
        setEditDesignation(designation);
        setOpenModal(true);
    };
    const handleDeleteDesignation = (designation) => {
        if (designation.employeeList && designation.employeeList.length > 0) {
            setAlert({
                open: true,
                severity: 'warning',
                message: `Cannot delete designation "${designation.label}" as it has assigned employees. Please reassign or remove employees before deleting.`
            });
        } else {
            setDesignationToDelete(designation);
            setDeleteModalOpen(true);
        }
    };
    const handleClose = () => {
        console.log(' i am triggered')
        setEditDesignation(null)
        setOpenModal(false)
    }
    const handleConfirmDelete = () => {
        if (designationToDelete) {
            const formData = new FormData();
            formData.append('id', designationToDelete.id);

            dispatch(deleteDesignationById(formData))
                .then((result) => {
                    if (result.payload.SUCCESS === 1) {
                        setAlert({
                            open: true,
                            severity: 'success',
                            message: 'Designation deleted successfully'
                        });
                        setChanges(prev => prev + 1); // Trigger re-fetch of designations
                    } else {
                        setAlert({
                            open: true,
                            severity: 'error',
                            message: result.payload.USER_MESSAGE || 'Failed to delete designation'
                        });
                    }
                })
                .catch((err) => {
                    setAlert({
                        open: true,
                        severity: 'error',
                        message: err.USER_MESSAGE || 'Something went wrong while deleting the designation'
                    });
                })
                .finally(() => {
                    setDeleteModalOpen(false);
                    setDesignationToDelete(null);
                });
        }
    };
    console.log(changes)
    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box>
            {openModal && (
                <AddDesignation
                    setAddDesignation={setOpenModal}
                    setDesignations={() => { }}
                    firmId={JSON.parse(localStorage.getItem('AutoBeatXData')).firmId}
                    setItemAdded={setChanges}
                    designation={editDesignation}
                    handleClose={handleClose}
                />
            )}
            <ConfirmDeleteModal
                open={deleteModalOpen}
                handleClose={() => setDeleteModalOpen(false)}
                handleConfirm={handleConfirmDelete}
                title="Confirm Delete Designation"
                content={`Are you sure you want to delete the designation "${designationToDelete?.label}"? This action cannot be undone.`}
            />
            <AlertMessage open={alert.open} setAlert={setAlert} severity={alert.severity} message={alert.message} />

            {/* <Stack p={2}>
                <Box onClick={() => { navigate(-1) }} sx={{ cursor: 'pointer', width: '70px' }} display='flex' flexDirection='row' alignItems='center'>
                    <ArrowBackIcon fontSize='small' sx={{ color: 'primary.main', mr: 1.5 }} />
                    <Typography variant='h6' fontWeight={600}>Back</Typography>
                </Box>
            </Stack> */}
            <Box px={2}>
                <Breadcrumb />
            </Box>


            <Box>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'end'} mb={2} px={2}>
                    <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <Typography variant='h5' sx={{ color: 'primary.main', pl: 1 }}>Designations</Typography>
                    </Stack>
                    <Stack direction={'row'} spacing={2}>
                        <TextField
                            onChange={handleSearch}
                            value={search}
                            color='primary'
                            sx={{
                                width: '250px',
                                '& .MuiInputBase-root': {
                                    border: 'none !important',
                                    // borderRadius: '30px !important'
                                },
                                '& .MuiOutlinedInput-input': {
                                    pl: 0
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    // border: 'none',
                                },
                            }}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconSearch color='gray' size="1.1rem" />
                                    </InputAdornment>
                                ),
                            }}
                            placeholder="Search by designation name"
                            size="small"

                        />
                        <Box >
                            <Button sx={{ bgcolor: 'primary.main', color: 'white' }} size='large' onClick={() => setOpenModal(true)}>
                                Add New Designation <AddIcon fontSize='small' sx={{ ml: 1 }} />
                            </Button>
                        </Box>
                    </Stack>
                </Stack>
                <Paper variant="outlined" sx={{ mx: 2, mt: 1 }}>
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length} align="center">
                                            <Box color={'primary.main'} className='text-center flex justify-center'>
                                                <div className='animate-spin'>
                                                    <IconLoader2 size={30} />
                                                </div>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={headCells.length} align="center">
                                            <Typography color="textSecondary">
                                                No designations found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.title);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <StyledTableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell>
                                                        {row.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography fontWeight={600} className='max-w-[10rem] overflow-hidden text-ellipsis whitespace-nowrap'>
                                                                {row.label}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>


                                                    <TableCell>
                                                        {row.employeeList && row.employeeList.length > 0 ? (
                                                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                                                {row.employeeList.slice(0, 10).map((employee, idx) => (
                                                                    <Tooltip key={idx} title={`${employee.fullName} (${employee.employeeNo})`}>
                                                                        <Chip
                                                                            avatar={
                                                                                <Avatar src={`https://ams.autobeatx.co.uk:8081/AMS/Users/GetProfileImageByFileName?fileName=${employee.profileFileName}`} sx={{ bgColor: 'gray !important' }} />
                                                                            }
                                                                            label={employee.fullName.split(' ')[0]}

                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    </Tooltip>
                                                                ))}
                                                                {row.employeeList.length > 10 && (
                                                                    <Tooltip title={row.employeeList.slice(10).map(e => `${e.fullName} (${e.employeeNo})`).join(', ')}>
                                                                        <Chip
                                                                            label={`+${row.employeeList.length - 10}`}
                                                                            size="small"
                                                                            color="primary"
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </Stack>
                                                        ) : (
                                                            <Typography variant="body2" color="text.secondary">No employees</Typography>
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Tooltip title="Edit Designation">
                                                            <IconButton
                                                                sx={{ color: 'primary.main' }}
                                                                onClick={() => handleEditDesignation(row)}
                                                                size="small"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete Designation">
                                                            <IconButton
                                                                sx={{ color: '#FA896B' }}
                                                                onClick={() => handleDeleteDesignation(row)}
                                                                size="small"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </StyledTableRow>
                                            );
                                        })
                                )}
                                {!isLoading && rows.length > 0 && emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (dense ? 33 : 53) * emptyRows,
                                        }}
                                    >
                                        <TableCell colSpan={headCells.length} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
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

export default DesignationsList;
