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

export default function AttractionsList() {
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

  useEffect(() => {
    if (tripDetails.stops) {
      const newStops = [...tripDetails.stops];
      newStops.forEach((stop) => {delete stop.routeFromHere});
      console.log(tripDetails.stops)
      axios
        .get('/api/roadtrip/yelpUrl', { params: {stops: tripDetails.stops} })
        .then((res) => {
          // changeStops(res.data, 1);
          // setSelectedList((prevSelectedList) => [...prevSelectedList, stop]);
          console.log(res.data);
        })  
        .catch((err) => {
          console.log(err);
        });
    }
  }, [tripDetails.stops]);

  useEffect(() => {
    if (tripDetails) {
      setAllAttractions(tripDetails.allStops);
      tripDetails.stops.forEach((stop) => {
        if (stop.category !== 'start' && stop.category !== 'end' && !selectedAttractions.some(item => item.id === stop.id)) {
          selectedAttractions.push(stop);
          
        }
      });
      setSelectedAttractions(selectedAttractions);
    }
 }, [tripDetails, tripDetails && tripDetails.allStops]);

  /* stop selection functions */
  const handleStopSelection = (stop, selectedList, setSelectedList) => {
    if (!tripDetails.allStops.some((e) => e.place_id === stop.place_id)) {
      return;
    }
    if (stop.routeFromHere) {
      delete stop.routeFromHere;
    }
    const index = tripDetails.stops.findIndex((selectedStop) => selectedStop.place_id === stop.place_id);
    const newStops = tripDetails.stops.map(stop => {
      const stopCopy = { ...stop };
      delete stopCopy.routeFromHere;
      return stopCopy;
    }); 
    
    if (index === -1) {
      // Remove Stop from route
      axios
      .get('/api/roadtrip/addStop', { params: {newStop: stop, stops: newStops} })
      .then((res) => {
        changeStops(res.data, 1);
        setSelectedList((prevSelectedList) => [...prevSelectedList, stop]);
      })  
      .catch((err) => {
        console.log(err);
      });
    } else {
      // Add Stop from route
      axios
      .get('/api/roadtrip/removeStop', { params: {indexToRemove: index, stops: newStops} })
      .then((res) => {
        changeStops(res.data, -1);
        setSelectedList((prevSelectedList) =>
        prevSelectedList.filter((s) => s.place_id !== stop.place_id)
      );
      })  
      .catch((err) => {
        console.log(err);
      });
    }
  };

return (
    <Box
      sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', height: '100%', alignContent: 'center', alignItems: 'start', padding: '0', width: '100%' }}
    >
      <Container value={value} index={0} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {tripDetails.stops.map((stop, index) => (
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
              }}
              onClick={() => handleExpandCard(index)}
            >
                {stop.category === 'Hotel' && (
                    <CardMedia
                      sx={{ height: expandedCard === index ? 140 : 60, flex: '0 0 40%' }}
                      image={LandMarkImage}
                      title="LandMarkImage"
                    />

                )}
              <CardContent sx={{ flex: '1' }}>
                <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                  <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
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
                {/* Display additional content if the card is expanded */}
                {expandedCard === index && (
                  <div>
                    <Grid item xs={12} sx={{ color: 'grey' }}>
                      {stop.rating} <StarRateIcon sx={{ verticalAlign: 'text-bottom', color: 'gold' }}></StarRateIcon> ({stop.reviews})
                    </Grid>
                    <Grid item xs={12} sx={{ fontWeight: 'bold' }}>
                      ${stop.price}/night
                    </Grid>
                  </div>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', flex: '0 0 5%' }}>
                <Checkbox
                  icon={<AddLocationAltOutlinedIcon />}
                  checkedIcon={<AddLocationAltIcon />}
                  checked={true}
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