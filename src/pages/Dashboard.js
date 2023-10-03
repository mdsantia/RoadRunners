import React from 'react';
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
    height: '80vh',
    flexDirection: 'column'
});




export default function Dashboard() {

    const [startLocation, setStartLocation] = useState("Chicago");
    const [endLocation, setEndLocation] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <div style={{ backgroundColor: 'white', height: '100vh' }}>
            <TopBar></TopBar>
            <Container>
            <CreateTrip></CreateTrip>
            </Container>
        </div>
    );
}
