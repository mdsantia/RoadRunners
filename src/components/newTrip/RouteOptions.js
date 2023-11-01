import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider, Container, Typography, Grid } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function RouteOptions() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { routes, updateChosenRoute, chosenRoute } = useDirectionContext();
    const [expanded, setExpanded] = React.useState([]); // Initialize expanded state for each accordion

    const handleChange = (index) => (event, isExpanded) => {
        const newExpanded = [...expanded];
        newExpanded[index] = isExpanded;
        setExpanded(newExpanded);
    };

    const handleButton = (event) => {
        updateChosenRoute(parseInt(event.currentTarget.id));
    };

    console.log(routes);

    return (
        <div style={{ height: '58vh', overflowY: 'auto' }}>
            <Container sx={{ padding: '0' }}>
                <List sx={{ padding: '0' }}>
                    {routes && routes.map((path, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                id={index}
                                value={index}
                                onClick={(event) => handleButton(event)}
                                sx={{
                                    width: '100%',
                                    backgroundColor: index === chosenRoute ? '#e3e3e3' : 'transparent', // Change the background color
                                    color: index === chosenRoute ? '#fff' : 'inherit', // Change the text color
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: index === chosenRoute ? '#d1d1d1' : '#f5f5f5', // Change the background color on hover
                                    },
                                }}
                            >
                                <Accordion expanded={expanded[index]} onChange={handleChange(index)} 
                                    sx={{ 
                                        width: '100%',
                                        border: '1px solid #ccc',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                        backgroundColor: '#fff',
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        id={index}
                                    >
                                        <Typography sx={{ fontWeight: 'bold'}}>Route #{index}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            <span sx={{ fontWeight:'bold' }}>Distance: </span><span sx={{ fontStyle: 'italic' }}>{path.distance.text}</span>
                                        </Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>Duration: {path.duration.text}</Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>Number of Stops: {path.stops.length}</Typography>
                                        {path.stops && path.stops.map((stop, stopIndex) => (
                                                <Typography key={stopIndex}>Stop #{stopIndex}: {stop.name}</Typography>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {!routes && <p>Loading...</p>}
                </List>
            </Container>
        </div>
    );
}

export default RouteOptions;
