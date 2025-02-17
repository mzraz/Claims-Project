import React from 'react';
import { Button, Dialog, AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import Slide from '@mui/material/Slide';
import { IconX } from '@tabler/icons';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const FullscreenDialog = (props) => {
    const { open, setOpen } = props

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            {/* <Button variant="contained" color="error" fullWidth onClick={handleClickOpen}>
                Open Fullscreen Dialog
            </Button> */}
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <IconX width={24} height={24} />
                        </IconButton>
                        <Typography ml={2} flex={1} variant="h6" component="div">
                            {props.title}
                        </Typography>
                        {/* <Button autoFocus color="inherit" onClick={handleClose}>
                            Save
                        </Button> */}
                    </Toolbar>
                </AppBar>
                {props.children}
                {/* <List>
                    <ListItem button>
                        <ListItemText primary="Phone ringtone" secondary="Titania" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText
                            primary="Default notification ringtone"
                            secondary="Tethys"
                        />
                    </ListItem>
                </List> */}
            </Dialog>
        </>
    );
}

export default FullscreenDialog;
