import { React, useState } from 'react';
import axios from 'axios';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Map from '../components/Map';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
  flexDirection: 'column'
});

export default function MapPage() {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  // const [mapKey, setMapKey] = useState(0);
  
  const buildRoadTrip = () => {
    axios.get('/api/roadtrip/newRoadTrip')
      .then(res => {
        console.log(res.data);
        setDirectionsResponse(res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }
  
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <button onClick={buildRoadTrip}>HELLO</button>
      <Container>
        <Map directionsResponse={directionsResponse}></Map>
      </Container>
    </div>
  );
}
