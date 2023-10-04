import React from 'react';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/TopBar';
import CreateTrip from '../components/CreateTrip'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
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
const MapWrapper = styled('div')({
    width: '100%', // Set the width to 100%
    height: '100%', // Set the height to 100%
    position: 'absolute', // Set position to absolute
    top: 0,
    left: 0,
});

export default function Dashboard() {

    const { startLocation, endLocation, startDate, endDate } = useParams();

      return (
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
            <TopBar></TopBar>
            <Container>
                <CreateTripContainer>
                    {/* Add your CreateTrip component here */}
                    <CreateTrip startLocation={startLocation} endLocation={endLocation} startDate={startDate} endDate={endDate}/>
                </CreateTripContainer>
                <MapWrapper>
                    {/* Add your Map component here */}
                    <Map />
                </MapWrapper>
            </Container>
        </div>
    );
}
