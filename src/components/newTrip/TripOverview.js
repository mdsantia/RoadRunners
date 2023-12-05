import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import HotelCard from '../StopsComponents/Hotels';
import { useEffect } from 'react';
import {useDashboardContext} from '../../context/DashboardContext'
import { Container, Typography, CardMedia, CardContent, Grid, CardActions, Checkbox, Divider } from '@mui/material';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LandMarkImage from '../../assets/FHV-image.jpeg';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StarRateIcon from '@mui/icons-material/StarRate';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function AttractionsList(viewOnly) {
    const [value, setValue] = React.useState(0);
    const [selectedHotels, setSelectedHotels] = useState([]);
    const [selectedLandmarks, setSelectedLandmarks] = useState([]);
    const [selectedAttractions, setSelectedAttractions] = useState([]);
    const [allAttractions, setAllAttractions] = useState([]);
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
    const [selectedLiveEvents, setSelectedLiveEvents] = useState([]);
    const [selectedGasStations, setSelectedGasStations] = useState([]);
    const { tripDetails, changeStops } = useDashboardContext();
    const [expandedCard, setExpandedCard] = useState(null);

    const handleExpandCard = (index) => {
        setExpandedCard(index === expandedCard ? null : index);
    };

    // useEffect(() => {
    //     if (tripDetails && tripDetails.stops) {
    //         const newStops = [...tripDetails.stops];
    //         newStops.forEach((stop) => {
    //                 const newStop = {...stop};
    //                 delete newStop.routeFromHere});
    //         console.log(tripDetails.stops);
    //         axios.get('/api/roadtrip/yelpUrl', { params: {stops: tripDetails.stops} })
    //         .then((res) => {
    //         // changeStops(res.data, 1);
    //         // setSelectedList((prevSelectedList) => [...prevSelectedList, stop]);
    //             console.log(res.data);
    //         })  
    //         .catch((err) => {
    //             console.log(err);
    //         });
    //     }
    // }, [tripDetails.stops]);

    useEffect(() => {
        if (tripDetails && tripDetails.allStops) {
            setAllAttractions(tripDetails.allStops);
            tripDetails.stops.forEach((stop) => {
                if (stop.category !== 'start' && stop.category !== 'end' && !selectedAttractions.some(item => item.id === stop.id)) {
                selectedAttractions.push(stop);
                }
            });
        }
    }, [tripDetails, tripDetails && tripDetails.stops]);

     /* stop selection functions */
    const handleStopSelection = (stop, selectedList, setSelectedList) => {
      delete stop.routeFromHere;
      const index = tripDetails.stops.findIndex((selectedStop) => selectedStop.place_id === stop.place_id);
      const newStops = tripDetails.stops.map(stop => {
      const stopCopy = { ...stop };
    //   delete stopCopy.routeFromHere;
      return stopCopy;
      }); 
      
      // Remove Stop from route
      axios
      .post('/api/roadtrip/removeStop', {indexToRemove: index, stops: newStops} )
      .then((res) => {
        changeStops(res.data, -1);
        setSelectedList((prevSelectedList) =>
        prevSelectedList.filter((s) => s.place_id !== stop.place_id)
      );
      })  
      .catch((err) => {
        console.log(err);
      });
    };

    const getRouteDetails = (infoLabel, info) => {
        return (
            <Grid container alignItems="left" textAlign="left" spacing={0}>
                <Grid item xs={5} sm={5} md={5}>
                    <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                        {infoLabel}
                    </Typography>
                </Grid>
                <Grid item xs={7} sm={7} md={7}>
                    <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
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
        );
    }

    return (
        <Box
        sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', height: '100%', alignContent: 'center', alignItems: 'start', padding: '0', width: '100%' }}
        >
        <Container value={value} index={0} style={{ maxHeight: '400px', overflowY: 'auto', textAlign: 'left', alignItems: 'left'}}>
            {getRouteDetails("Starting Location:", tripDetails.stops[0].name)}
            <br></br>
            {getRouteDetails("Destination:", tripDetails.stops[tripDetails.stops.length - 1].name)}
            <br></br>
            {getRouteDetails("Total Number of Stops:", tripDetails.stops.length - 2)}
            <br></br>
            {getRouteDetails("Number of Vehicles:", tripDetails.numVehicles)}
            <br></br>
            <Divider></Divider>
            <br></br>
            <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                Your Selected Vehicle(s) for This Trip:
            </Typography>
            {tripDetails.selectedVehicles.map((vehicle, index) => (
                <li variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                    {vehicle}
                </li>
            ))}
            <br></br>
            <Divider></Divider>
            <br></br>
            <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                Stops Along Your Route:
            </Typography>
            {tripDetails.stops.slice(1, -1).map((stop, index) => ( // Slice to exclude first and last stops
            <div key={index}>
                <Item
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        maxWidth: '100%',
                        margin: '0 auto',
                        marginTop: '3%',
                        cursor: 'pointer',
                        transition: 'height 0.3s', // Define the transition property
                        height: expandedCard === index ? 140 : 60, // Set initial and expanded height
                        backgroundColor: '#f5f5f5'
                    }}
                    onClick={() => handleExpandCard(index)}
                >
                    <CardContent sx={{ flex: '1' }}>
                        <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                        <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                            <a
                            href={stop.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                            {stop.name}
                            </a>
                        </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions 
                      sx={{ justifyContent: 'center', flex: '0 0 5%' }}
                      onClick={(e) => {
                          e.stopPropagation(); // Stop the click event from propagating to the parent element
                      }}>
                        <Checkbox
                        icon={<AddLocationAltOutlinedIcon />}
                        checkedIcon={<AddLocationAltIcon />}
                        checked={true}
                        disabled={viewOnly}
                        onChange={() => handleStopSelection(stop, selectedAttractions, setSelectedAttractions)}
                        />
                    </CardActions>
                </Item>
            </div>
            ))}
        </Container>
        </Box>
    );
}