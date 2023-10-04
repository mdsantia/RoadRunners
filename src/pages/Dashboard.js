import React from 'react';
import axios from 'axios';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/TopBar';
import CreateTrip from '../components/CreateTrip'
import { useState } from 'react';
import Map from '../components/Map';
import Divider from '@mui/material/Divider';

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    height: '90vh',
    flexDirection: 'column',
    position: 'relative', // Set position to relative
});
const CreateTripContainer = styled('div')({
    position: 'relative',
    zIndex: 2, // Set a higher z-index for CreateTrip to make it appear above Map
    backgroundColor: 'rgba(255, 255, 255, 0)', // Make CreateTripContainer semi-transparent
});
const MapWrapper = styled(Card)({
    width: '50%', // Set the width to 100%
    height: '90%', // Set the height to 100%
    position: 'absolute', // Set position to absolute
    top: '4%',
    left: '2%',
    borderRadius: 20,
});

export default function Dashboard() {

    const [startLocation, setStartLocation] = useState("Chicago");
    const [endLocation, setEndLocation] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [directionsResponse, setDirectionsResponse] = useState(null);

    const buildRoadTrip = () => {
        axios
          .get('/api/roadtrip/newRoadTrip')
          .then((res) => {
            console.log(res);
            setDirectionsResponse(res.data); // Use res.data to set the directionsResponse
          })
          .catch((err) => {
            console.log(err);
          });
      };

      return (
        <div style={{ backgroundColor: '#F3F3F5', height: '100vh' }}>
            <TopBar></TopBar>
            <Container>
                <CreateTripContainer>
                    {/* Add your CreateTrip component here */}
                    <CreateTrip/>
                </CreateTripContainer>
                <MapWrapper>
                    {/* Add your Map component here */}
                    <Map directionsResponse={directionsResponse}/>
                </MapWrapper>
            </Container>
        </div>
    );
}
