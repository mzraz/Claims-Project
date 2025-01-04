// components/Schedule/ScheduleHeader.jsx
import { Stack, Typography, Button, IconButton, Box, lighten } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import dayjs from 'dayjs';

const ScheduleHeader = ({ currentWeek, onWeekChange, isFullScreen, onToggleFullScreen }) => {
  const startOfWeek = dayjs(currentWeek).format('D MMMM');
  const endOfWeek = dayjs(currentWeek).endOf('week').add(1, 'day').format('D MMMM');
  const currentYear = dayjs(currentWeek).format('YYYY');

  const handleCurrentWeek = () => {
    // Set to current week's Monday
    const today = dayjs().startOf('week').add(1, 'day');
    // Directly set the current week instead of using the week change handler
    onWeekChange('current', today.toDate());
  };

  return (
    <Box
      sx={{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        bgcolor: (theme) => lighten(theme.palette.primary.main, 0.9),

        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={1}>
        <Typography variant="h4" color="primary">
          {`${startOfWeek} - ${endOfWeek}, ${currentYear}`}
        </Typography>

        <Stack direction="row" alignItems="center">
          <IconButton onClick={onToggleFullScreen} sx={{ mr: 3 }}>
            {isFullScreen ? (
              <FullscreenExitIcon color="primary" />
            ) : (
              <FullscreenIcon color="primary" />
            )}
          </IconButton>

          <Box className="space-x-2">
            <IconButton onClick={() => onWeekChange('prev')}>
              <KeyboardArrowLeftIcon color="primary" />
            </IconButton>

            <Button
              variant="contained"
              size="small"
              onClick={() => {
                const today = dayjs().startOf('week').add(1, 'day').toDate();
                onWeekChange('current', today);
              }}
            >
              Current Week
            </Button>

            <IconButton onClick={() => onWeekChange('next')}>
              <KeyboardArrowRightIcon color="primary" />
            </IconButton>
          </Box>

          {/* Optional: Add export/other actions here */}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ScheduleHeader;
