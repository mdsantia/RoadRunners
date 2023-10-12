import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { createTheme, ThemeProvider, Container, Typography } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ListIcon from '@mui/icons-material/List';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PublicIcon from '@mui/icons-material/Public';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const drawerWidth = 250;

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

export const pageOptions = ['Account Information', 'Trip Preferences', 'Vehicles', 'Trip History'];
const Icons = ['AccountCircleIcon', 'FavoriteIcon', 'DirectionsCarIcon', 'PublicIcon'];

function SideBar(props) {

    const ComponentMap = {
        AccountCircleIcon,
        FavoriteIcon,
        DirectionsCarIcon,
        PublicIcon
    };

    const navigate = useNavigate();
    const {user} = useUserContext();

    const handleButton = (event) => {
        const pageType = pageOptions[pageOptions.indexOf(event.currentTarget.id)];
        navigate(`/profile/${pageType}/${user._id}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Drawer
                    variant="permanent"
                    open
                    sx={{
                        display: "flex",
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', zIndex: '0'},
                    }}
                    >
                    <CssBaseline/>
                    <List sx={{ paddingTop: '90px' }}>        
                        {pageOptions.map((text, index) => (
                            <ListItem 
                                key={text} 
                                disablePadding 
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
            </Container>
        </ThemeProvider>
    );
}
export default SideBar;
