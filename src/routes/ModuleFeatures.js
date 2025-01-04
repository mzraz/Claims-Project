import React from 'react';
import { Paper, Grid, Typography, Box, Card } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  RoomPreferences as RoomPreferencesIcon,
  TableRows as TableRowsIcon,
  CalendarMonth as CalendarMonthIcon,
  CopyAll as CopyAllIcon,
  Fingerprint as FingerprintIcon,
  PendingActions as PendingActionsIcon,
  DateRange as DateRangeIcon,
  AccountCircle as AccountCircleIcon,
  Key as KeyIcon,
  Domain as DomainIcon,
  ManageAccounts as ManageAccountsIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';

const iconMap = {
  RoomPreferencesIcon,
  TableRowsIcon,
  CalendarMonthIcon,
  CopyAllIcon,
  FingerprintIcon,
  PendingActionsIcon,
  DateRangeIcon,
  AccountCircleIcon,
  KeyIcon,
  DomainIcon,
  ManageAccountsIcon,
  PersonRemoveIcon,
};

const ModuleFeatures = ({ moduleName }) => {
  const { user } = useSelector((state) => state.loginReducer);
  const theme = useTheme();

  const renderFeatures = () => {
    if (!user.userFeatures || user.userFeatures.length === 0) {
      return (
        <Typography variant="h6" sx={{ p: 3 }}>
          No features available. Please contact your administrator.
        </Typography>
      );
    }

    const moduleFeatures = user.userFeatures.filter(
      (feature) => feature.featureGroupLabel === moduleName,
    );

    return moduleFeatures.map((feature, index) => {
      const Icon = iconMap[feature.featureIcon] || (() => null);

      return (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Link to={feature.featureURL} style={{ textDecoration: 'none' }}>
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
                  <Typography variant="h6">{feature.featureLabel}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {feature.featureDescription}
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
        <motion.div
          //   initial="hidden"
          //   animate="visible"
          key={moduleName}
          variants={{
            hidden: { opacity: 0.3, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
        >
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
            {moduleName}
          </Typography>
        </motion.div>
      </Box>
      <Grid container spacing={3}>
        {renderFeatures()}
      </Grid>
    </Box>
  );
};

export default ModuleFeatures;
