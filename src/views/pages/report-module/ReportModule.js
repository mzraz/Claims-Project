import React, { useEffect } from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getReportFeatures } from '../../../store/report/ReportSlice';

const ReportModule = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const ReportFeatures = useSelector((state) => state.reportReducer.features);

    useEffect(() => {
        dispatch(getReportFeatures())
    }, [])

    const managementAreas = [
        {
            name: 'Employee Report',
            description: 'View Employee Report',
            icon: <AssessmentIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            toList: '/report/employee'
        },
        {
            name: 'Attendance Report',
            description: 'View Attendance Report',
            icon: <AssessmentIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            toList: '/report/attendance'
        },
        {
            name: 'Leave Report',
            description: 'View Leave Report',
            icon: <AssessmentIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            toList: '/report/leave'
        }
    ];

    const BCrumb = [
        {
            title: 'Report',
        }
    ];

    return (
        <div>
            <Breadcrumb title="Report Module" items={BCrumb} />

            <Grid sx={{ flexGrow: 1 }} container spacing={3}>
                {managementAreas.map((data, index) =>
                    <Grid key={index} item sm={12} md={6} lg={4}>
                        <Card
                            sx={{ width: '360px' }}
                            variant="elevation"
                            elevation={9}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <Stack direction="row" spacing={1}>
                                    {data.icon}
                                    <Box>
                                        <Typography variant='h4'>{data.name}</Typography>
                                        <br />
                                        <Typography variant='subtitle1'>{data.description}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                            <CardActions disableSpacing={true}>
                                <Stack direction='row' justifyContent='end' spacing={2} sx={{ width: '100%' }}>
                                    <Link to={data.toList}>
                                        <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                            View
                                        </Button>
                                    </Link>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default ReportModule