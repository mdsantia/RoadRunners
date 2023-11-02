import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider, Container, Typography } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { useNavigate } from "react-router-dom";

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
    const { tripDetails, setTripDetails, updateChosenRoute } = useDashboardContext();
    const [options, setOptions] = React.useState(null);
    const [chosenRoute, setChosenRoute] = React.useState(0);

    React.useEffect(() => {
        if (tripDetails) {
            setOptions(tripDetails.options);
            setChosenRoute(tripDetails.chosenRoute);
        }
    }, [tripDetails, tripDetails && tripDetails.options, tripDetails && tripDetails.chosenRoute]);

    const handleButton = (event) => {
        updateChosenRoute(parseInt(event.currentTarget.id));
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <List sx={{ paddingTop: '90px' }}>
                    {options && options.map((path, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                id={index}
                                value={index}
                                onClick={(event) => handleButton(event)}
                                sx={{
                                    backgroundColor: index === chosenRoute ? 'darkblue' : 'transparent', // Change the background color
                                    color: index === chosenRoute ? '#fff' : 'inherit', // Change the text color
                                    borderRadius:4,
                                }}
                            >
                                <ListItemText sx={{ fontStyle: 'italic' }}>Route #{index}</ListItemText>
                                {/* <ListItemText>Distance: {path.distance.text}</ListItemText>
                                <ListItemText>Duration: {path.duration.text}</ListItemText> */}
                                {/* <ListItemText
                                    primary={`Index: ${index}, Distance: ${path.distance.text} & Duration: ${path.duration.text}`}
                                /> */}
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {!options && <p>Loading...</p>}
                </List>
            </Container>
        </ThemeProvider>
    );
}

export default RouteOptions;
