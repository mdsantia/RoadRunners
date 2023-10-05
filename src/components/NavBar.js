import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material';
import { useUserContext } from '../hooks/useUserContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";


const drawerWidth = 240;

const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
});

function NavBar() {
    const pageOptions = ['Account Information', 'Trip Preferences', 'Vehicles', 'Trip History'];
    const navigate = useNavigate();
    const {user} = useUserContext();

    const handleButton = (event) => {
        console.log(event);
        if (event.currentTarget.id === "Account Information") {
            // navigate(`/accountInfo/${user._id}`");
        } else if (event.currentTarget.id === "Trip Preferences") {
            navigate(`/tripPreferences/${user._id}`);
        } else if (event.currentTarget.id === "Vehicles") {
            navigate(`/vehicles/${user._id}`);
        } else if (event.currentTarget.id === "Trip History") {
            // navigate(`/tripHistory/${user._id}`);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Drawer
                variant="permanent"
                open
                sx={{
                    display: "flex",
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', zIndex: '0'},
                }}
                >
                <CssBaseline/>
                <List sx={{ paddingTop: '100px' }}>
                    {pageOptions.map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton id={text} value={text} onClick={(event) => handleButton(event)}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </ThemeProvider>
    );
}
export default NavBar;
