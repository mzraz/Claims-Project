import React from 'react'
import Breadcrumb from '../../../layouts/full/shared/breadcrumb/Breadcrumb'
import { Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { Box, Stack } from '@mui/system';
import { Link } from 'react-router-dom';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import BusinessIcon from '@mui/icons-material/Business';

const OrganizationModule = () => {
    const navigate = useNavigate();

    const managementAreas = [
        {
            name: 'Organisation Structure',
            description: 'Under Development',
            icon: <BusinessIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            toList: ''
        },
        {
            name: 'Job desctiption',
            description: 'Under Development',
            icon: <WorkOutlineIcon sx={{ color: 'primary.main' }} fontSize='large' />,
            toList: ''
        }
    ];

    const BCrumb = [
        {
            title: 'Organization',
        }
    ];

    return (
        <div>
            <Breadcrumb title="Organization Module" items={BCrumb} />

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
                                    {/* <Link to={data.toList}>
                                        <Button variant="outlined" sx={{ color: 'primary.main !important', bgcolor: '#fff !important' }} size="small">
                                            View List
                                        </Button>
                                    </Link> */}
                                </Stack>
                            </CardActions>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default OrganizationModule