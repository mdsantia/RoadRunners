import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider, Container } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDirectionContext } from '../../context/DirectionContext';
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
    const { routes, updateChosenRoute, chosenRoute } = useDirectionContext();

    const handleButton = (event) => {
        updateChosenRoute(parseInt(event.currentTarget.id));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <List sx={{ paddingTop: '90px' }}>
                    {routes && routes.map((path, index) => (
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
                                    primary={`Index: ${index}, Distance: ${path.distance.text} & Duration: ${path.duration.text}`}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {!routes && <p>Loading...</p>}
                </List>
            </Container>
        </ThemeProvider>
    );
}

export default RouteOptions;
