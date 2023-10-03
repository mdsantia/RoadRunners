import React from 'react';
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
  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Container>
        <Map></Map>
      </Container>
    </div>
  );
}
