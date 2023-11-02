import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Container, Typography, Grid, Divider } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function RouteOptions() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { tripDetails, updateChosenRoute } = useDashboardContext();
    const [options, setOptions] = React.useState(null);
    const [chosenRoute, setChosenRoute] = React.useState(0);
    const [expanded, setExpanded] = React.useState(null);

    React.useEffect(() => {
        if (tripDetails) {
            setOptions(tripDetails.options);
            setChosenRoute(tripDetails.chosenRoute);
        }
    }, [tripDetails, tripDetails && tripDetails.options, tripDetails && tripDetails.chosenRoute]);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    const handleButton = (event) => {
        updateChosenRoute(parseInt(event.currentTarget.id));
    };

    const getRouteDetails = (infoLabel, info) => {
        return (
            <Grid container alignItems="left" textAlign="left" spacing={0}>
                <Grid item xs={5} sm={5} md={5}>
                    <Typography variant="body1" style={{ fontSize: '12px', textTransform: 'none', fontWeight: 'bold' }}>
                        {infoLabel}
                    </Typography>
                </Grid>
                <Grid item xs={7} sm={7} md={7}>
                    <Typography variant="body1" style={{ fontSize: '12px', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                        {info}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <div style={{ height: '58vh', overflowY: 'auto' }}>
            <Container disableGutters>
                <List>
                    {/* {routes && routes.map((path, index) => (
                        <ListItem key={index}>
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
                    {!routes && <p>Loading...</p>} */}
                    {options && options.map((path, index) => (
                        <ListItem key={index}>
                            <ListItemButton
                                id={index}
                                value={index}
                                onClick={(event) => handleButton(event)}
                                sx={{
                                    width: '100%',
                                    backgroundColor: index === chosenRoute ? '#e3e3e3' : 'transparent', // Change the background color
                                    color: index === chosenRoute ? '#fff' : 'inherit', // Change the text color
                                    padding: 0,
                                    margin: 0.3
                                }}
                                disableGutters
                            >
                                <Accordion expanded={expanded === index} onChange={handleChange(index)} 
                                    sx={{ 
                                        width: '100%',
                                        backgroundColor: '#fff',
                                        '&:hover': {
                                            backgroundColor: index === chosenRoute ? '#d1d1d1' : '#f5f5f5', // Change the background color on hover
                                        },
                                    }}
                                    disableGutters
                                >
                                    <AccordionSummary id={index}
                                        sx={{ 
                                            backgroundColor: index === chosenRoute ? '#f5f5f5' : 'inherit',
                                        }}
                                    >
                                        <Typography variant="button" style={{ fontSize: '13px' }}>
                                            Route #{index + 1}
                                        </Typography>
                                    </AccordionSummary>
                                    <Divider></Divider>
                                    <AccordionDetails sx={{ backgroundColor: index === chosenRoute ? '#f5f5f5' : 'inherit' }}>
                                        {/* {getRouteDetails("Total Distance:", path.distance)} */}
                                        {/* {getRouteDetails("Trip Duration:", path.duration)} */}
                                        {getRouteDetails("Number of Stops:", path.length)}
                                        {getRouteDetails("Categories of Stops:", path[1].category)}   
                                        {getRouteDetails("Popular Stops Along This Route:", path[0] + ", " + path[1] + ", " + path[2])}
                                        <Typography variant="body1" style={{ fontSize: '12px', textTransform: 'none', fontWeight: 'bold' }}>
                                            Stops: {path.map((stop, stopIndex) => (
                                                stopIndex === path.length - 1 ? 
                                                    <span key={stopIndex}> {stop.name}</span> :
                                                    <span key={stopIndex}> {stop.name} ={'>'} </span>
                                            ))}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Container>
        </div>
    );
}

export default RouteOptions;
