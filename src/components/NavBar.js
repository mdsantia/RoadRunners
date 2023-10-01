import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Navigate, useNavigate, useLocation } from "react-router-dom";


const drawerWidth = 240;

function NavBar() {
    const [page, setPage] = React.useState(null);
    const navigate = useNavigate();
    const handleButton = (text) => {
        if (text === "Account Information") {
            // navigate("/accountInfo");
        } else if (text === "Trip Preferences") {
            navigate("/tripPreferences");
        } else if (text === "Vehicles") {
            navigate("/vehicles");
        } else if (text === "Trip History") {
            // navigate("/tripHistory");
        }
    }

    return (
        <Drawer
            variant="permanent"
            open
            sx={{
                display: "flex",
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', zIndex: '0'},
            }}
        >
            <CssBaseline/>
            <List>
                {['Account Information', 'Trip Preferences', 'Vehicles', 'Trip History'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton value={text} onClick={() => handleButton(text)}>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}
export default NavBar;
