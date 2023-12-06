import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Container, Typography, Box, Toolbar, Divider, Grid, Paper } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { useUserContext } from '../../hooks/useUserContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PublicIcon from '@mui/icons-material/Public';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logo from '../../assets/rr-logo.png';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    backgroundColor: 'darkblue',
    marginTop: '75px',
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth - 1}px`,
        transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
  
const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const pageOptions = ['Account', 'Trip Preferences', 'Vehicles', 'Saved Trips', 'Trips Shared With Me'];
const Icons = ['AccountCircleIcon', 'FavoriteIcon', 'DirectionsCarIcon', 'PublicIcon', 'PublicIcon'];

function SideBar(props) {

    const ComponentMap = {
        AccountCircleIcon,
        FavoriteIcon,
        DirectionsCarIcon,
        PublicIcon
    };

    const navigate = useNavigate();
    const {user} = useUserContext();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    
    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    const handleButton = (event) => {
        const pageType = pageOptions[pageOptions.indexOf(event.currentTarget.id)];
        navigate(`/profile/${pageType}/${user._id}`);
    }

    return (
        <Box sx={{ display: 'flex' }} marginTop='75px'>
            <CssBaseline/>
            <AppBar  open={open}>
                <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'center' }}>
                    {props.pageType}
                </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        marginTop: '74px'
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
                >
            <Divider/>
            <DrawerHeader sx={{ backgroundColor: 'darkblue'}}>
                {/* <img src={Logo} alt="Logo" width={170} /> */}
                <Typography variant="h8" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'center', color: 'white' }}>
                    Menu Options
                </Typography>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{ color: 'white' }} /> : <ChevronRightIcon sx={{ color: 'white' }}/>}
                </IconButton>
            </DrawerHeader>
            <Divider />
                <List>        
                    {pageOptions.map((text, index) => (
                        <ListItem 
                            key={text} 
                            className="list-item"
                        >
                            <ListItemButton 
                                id={text} 
                                value={text} 
                                onClick={(event) => { 
                                    handleButton(event);
                                }}
                            >
                                <ListItemIcon>
                                    {ComponentMap[Icons[index]] && React.createElement(ComponentMap[Icons[index]])}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={ 
                                        <Typography 
                                            variant="body1" 
                                            style={{ fontWeight: text === props.pageType ? 'bold' : 'normal' }}
                                        >
                                            {text}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={open} 
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto'
                }}
            >
                <DrawerHeader/>
                    <Container>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            {props.container}
                        </Paper>
                    </Container>
            </Main>
        </Box>
    );
}
export default SideBar;
