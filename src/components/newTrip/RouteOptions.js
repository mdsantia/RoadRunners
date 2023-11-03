import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Container, Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import Checkbox from '@mui/material/Checkbox';


function RouteOptions() {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { tripDetails, updateChosenRoute } = useDashboardContext();
    const [options, setOptions] = React.useState(null);
    const [chosenRoute, setChosenRoute] = React.useState(0);
    const [expanded, setExpanded] = React.useState(null);
    const [selectedFilter, setSelectedFilter] = React.useState('');
    const filterOptions = ["Scenic", "Eventful", "Fastest"];

    // const handleFilterChange = (event) => {
    //     const {
    //       target: { value },
    //     } = event;
    //     setSelectedFilters(
    //       // On autofill we get a stringified value.
    //       typeof value === 'string' ? value.split(',') : value,
    //     );
    // };

    const handleFilterChange = (event) => {
        setSelectedFilter(event.target.value);
    };
    
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };
    
    const handleButton = (event) => {
        updateChosenRoute(parseInt(event.currentTarget.id));
    };

    const handleFilterSelect = (event) => {
        // TODO
    }
    
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
    
    React.useEffect(() => {
        if (tripDetails) {
            setOptions(tripDetails.options);
            setChosenRoute(tripDetails.chosenRoute);
        }
    }, [tripDetails, tripDetails && tripDetails.options, tripDetails && tripDetails.chosenRoute]);

    if (options) {
        return (
            <div style={{ height: '58vh', overflowY: 'auto' }}>
                <Container disableGutters>
                    <List>
                        {options.map((path, index) => (
                            <ListItem key={index} disablePadding>
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
                                    <Accordion expanded={expanded[index]} onChange={handleChange(index)} 
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
                                            <Typography variant="body1" style={{ fontSize: '12px', textTransform: 'none', fontWeight: 'bold' }}>
                                                stops: {path.map((stop, stopIndex) => (
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
    } else {
        <CircularProgress/>
    }
}

export default RouteOptions;
