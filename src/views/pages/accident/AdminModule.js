import React, { useEffect } from 'react';
import { Box, Grid, Typography, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { getAdminFeatures } from '../../../store/admin/AdminSlice';
import { RoomPreferences as RoomPreferencesIcon, Key as KeyIcon } from '@mui/icons-material';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import CarCrashIcon from '@mui/icons-material/CarCrash';
import AccessibleIcon from '@mui/icons-material/Accessible';
import StorageIcon from '@mui/icons-material/Storage';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
const iconMap = {
  RoomPreferencesIcon,
  KeyIcon,
  CarCrashIcon,
  DriveEtaIcon,
  AccessibleIcon,
  StorageIcon,
  HomeRepairServiceIcon,
  DocumentScannerIcon,
};

const AdminModule = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const adminFeatures = useSelector((state) => state.adminReducer.features);

  useEffect(() => {
    dispatch(getAdminFeatures());
  }, [dispatch]);

  const managementAreas = [
    {
      name: 'Accident Details',
      description: 'Add Accident Details',
      icon: 'RoomPreferencesIcon',
      to: '/admin/add-companies',
    },
    {
      name: 'Police Details',
      description: 'Police Details',
      icon: 'KeyIcon',
      to: '/admin/insurance',
    },
    {
      name: 'Witness/Other Party',
      description: 'Witness/Other Party',
      icon: 'DriveEtaIcon',
      to: '/admin/driver-detail',
    },

    {
      name: 'Accident Sketch/Previous Accidents',
      description: 'Accident Sketch/Previous Accidents',
      icon: 'CarCrashIcon',
      to: '/admin/vehicle-damage-detail',
    },

    {
      name: 'MiB Claims-for Uninsured Cases Only',
      description: 'MiB Claims-for Uninsured Cases Only',
      icon: 'AccessibleIcon',
      to: '/admin/recovery',
    },

    {
      name: 'Accident Involing a Bus or a Coach',
      description: 'Accident Involing a Bus or a Coach',
      icon: 'StorageIcon',
      to: '/admin/storage',
    },
    {
      name: 'Liability',
      description: 'Liability',
      icon: 'HomeRepairServiceIcon',
      to: '/admin/repairs',
    },

    // {
    //   name: 'Inspection',
    //   description: 'Inspection',
    //   icon: 'DocumentScannerIcon',
    //   to: '/admin/inspection',
    // },
  ];

  const renderFeatures = () => {
    return managementAreas.map((feature, index) => {
      const Icon = iconMap[feature.icon] || (() => null);

      return (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link to={feature.to} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  p: 3,
                  boxShadow: (theme) => theme.shadows[1],
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${theme.palette.divider}`,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    '& .feature-icon': {
                      color: theme.palette.primary.main,
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Icon
                    className="feature-icon"
                    sx={{
                      fontSize: 32,
                      color: theme.palette.primary.main,
                      mr: 2,
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <Typography variant="h6">{feature.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Link>
          </motion.div>
        </Grid>
      );
    });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ overflow: 'hidden', mb: 4, borderRadius: 0 }}>
        <motion.div key="AdminModule">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `3px solid ${theme.palette.primary.main}`,
              paddingBottom: 2,
              borderRadius: 0,
              display: 'inline-block',
            }}
          >
            Accident Report
          </Typography>
        </motion.div>
      </Box>
      <Grid container spacing={3}>
        {renderFeatures()}
      </Grid>
    </Box>
  );
};

export default AdminModule;
