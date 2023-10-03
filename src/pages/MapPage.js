import React from 'react';
import axios from 'axios';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Map from '../components/Map';

const buildRoadTrip = () => {
  axios.get('/api/roadtrip/newRoadTrip')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
  flexDirection: 'column'
});

export default function MapPage() {
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <button onClick={buildRoadTrip}>HELLO</button>
      <Container>
        <Map></Map>
      </Container>
    </div>
  );
}
