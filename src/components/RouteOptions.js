import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider, Container } from '@mui/material';
import { useUserContext } from '../hooks/useUserContext';
import { useDirectionContext } from '../context/DirectionContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";

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

function RouteOptions() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { directions, setChosenRoute, chosenRoute } = useDirectionContext();

    const handleButton = (event) => {
        setChosenRoute(parseInt(event.currentTarget.id));
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <CssBaseline />
                <List sx={{ paddingTop: '90px' }}>
                    {directions.routes.map((overview, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                id={index}
                                value={index}
                                onClick={(event) => handleButton(event)}
                                sx={{
                                    backgroundColor: index === chosenRoute ? '#000' : 'transparent', // Change the background color
                                    color: index === chosenRoute ? '#fff' : 'inherit', // Change the text color
                                    borderRadius:4,
                                }}
                            >
                                <ListItemText
                                    primary={`Index: ${index}, Distance: ${overview.legs[0].distance.text} & Duration: ${overview.legs[0].duration.text}`} //\nThrough ${overview.legs[0].waypointorder}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </ThemeProvider>
    );
}

export default RouteOptions;
