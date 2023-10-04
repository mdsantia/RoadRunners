import React from 'react';
import axios from 'axios';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/TopBar';
import CreateTrip from '../components/CreateTrip'
import { useState } from 'react';
import Divider from '@mui/material/Divider';

const Container = styled('div')({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    height: '90vh',
    position: 'relative', // Set position to relative
    flexDirection: 'column'
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
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
            <TopBar></TopBar>
            <Container>
            <CreateTrip></CreateTrip>
            </Container>
        </div>
    );
}
