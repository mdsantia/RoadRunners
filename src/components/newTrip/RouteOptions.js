import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Container } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';


function RouteOptions() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { tripDetails, updateChosenRoute } = useDashboardContext();
    const [options, setOptions] = React.useState(null);
    const [chosenRoute, setChosenRoute] = React.useState(0);
    const [expanded, setExpanded] = React.useState(null);
    const [selectedFilter, setSelectedFilter] = React.useState('');
    const [filteredRoutes, setFilteredRoutes] = React.useState([]);
    const filterOptions = ["None", "Shortest", "Fastest"];    

    // const handleFilterChange = (event) => {
    //     const {
    //       target: { value },
    //     } = event;
    //     setSelectedFilters(
    //       // On autofill we get a stringified value.
    //       typeof value === 'string' ? value.split(',') : value,
    //     );
    // };
                
    React.useEffect(() => {
        if (tripDetails) {
            setOptions(tripDetails.options);
            setChosenRoute(tripDetails.chosenRoute);
            setFilteredRoutes(tripDetails.options);
        }
    }, [tripDetails, tripDetails && tripDetails.options, tripDetails && tripDetails.chosenRoute]);

    
    const getShortestRoutes = (totalDistance) => {
        if (totalDistance && tripDetails.options) {
            let index = 0;
            const shortestRoutes = [];
            shortestRoutes.push(options[0]);
            for (let i = 1; i < totalDistance.length; i++) {
                if (totalDistance[i] < totalDistance[index]) {
                    shortestRoutes.pop();
                    shortestRoutes.push(options[i]);
                    index = i;
                } else if (totalDistance[i] === totalDistance[index]) {
                    shortestRoutes.push(options[i]);
                }
            }
            console.log("shortest " + shortestRoutes.length);
            return shortestRoutes;
        }
    }

    const getFastestRoutes = (totalDuration) => {
        if (totalDuration && tripDetails.options) {
            let index = 0;
            const fastestRoutes = [];
            fastestRoutes.push(options[0]);
            for (let i = 1; i < totalDuration.length; i++) {
                if (totalDuration[i] < totalDuration[index]) {
                    fastestRoutes.pop();
                    fastestRoutes.push(options[i]);
                    index = i;
                } else if (totalDuration[i] === totalDuration[index]) {
                    fastestRoutes.push(options[i]);
                }
            }
            return fastestRoutes;
        }
    }
                
    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };

    const handleFilterSelect = () => {
        if (selectedFilter === 'Shortest') {
            setFilteredRoutes(getShortestRoutes(tripDetails.totalDistance));
        } else if (selectedFilter === 'Fastest') {
            setFilteredRoutes(getFastestRoutes(tripDetails.totalDuration));
        } else {
            // If no filter is selected, show all routes
            setFilteredRoutes(tripDetails.options);
        }
    }

    const handleAccordionChange = (panel) => (event, isExpanded) => {
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

    if (tripDetails && !tripDetails.stops) {
        return (
            <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
            Awaiting for route suggestions...
            </Typography> 
        )
    }
    return (
        <div style={{ height: '58vh', overflowY: 'auto' }}>
            <Grid container spacing={2} alignItems="center" textAlign="left">
                <Grid item xs={10} sm={10} md={10}>
                    <InputLabel>Filter Routes By</InputLabel>
                    <Select
                        displayEmpty
                        value={selectedFilter}
                        onChange={handleFilterChange}
                        input={<OutlinedInput label="Tag" />}
                        sx={{ width: '100%', height: '5vh' }}
                    >
                        {filterOptions.map((option, index) => (
                            <MenuItem key={index} value={option} sx={{ paddingLeft: '3%' }}>
                                <ListItemText primary={option}/>
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
                <Grid item xs={2} sm={2} md={2} alignItems="center">
                    <Button 
                        sx={{ 
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                            backgroundColor: 'darkblue',
                            color: 'white',
                            marginTop: '22px',
                            '&:hover': {
                                backgroundColor: '#6495ed',
                            },
                        }}
                        onClick={handleFilterSelect}
                    >
                        Filter
                    </Button>
                </Grid>
            </Grid>
            <br></br>
            <Divider></Divider>
            <Container disableGutters>
                <List>
                    {filteredRoutes && filteredRoutes.map((path, index) => (
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
                                <Accordion expanded={expanded === index} onChange={handleAccordionChange(index)} 
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
                                        {getRouteDetails("Number of Stops:", path.length - 2)}
                                        {getRouteDetails("Categories of Stops:", path[1].category)}   
                                        {/* {getRouteDetails("Popular Stops Along This Route:", path[0] + ", " + path[1] + ", " + path[2])} */}
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