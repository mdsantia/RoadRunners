import React from 'react';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg'
import axios from 'axios';
import CreateTrip from '../components/CreateTrip'
import TopBar from '../components/TopBar';
import VehicleForm from '../pages/VehicleForm';



const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column'
});



const ImageCard = styled(Card)({
  position: 'relative',
  maxWidth: 2000,
  width: 1200,
  padding: 5,
  height: 500,
  borderRadius: 25,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
});


const StyledButton = styled(Button)({
  marginBottom: 10,
})

const newUser = () => {
  axios.post('api/user/newUser')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

export default function HomePage() {


  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      {/* <VehicleForm></VehicleForm> */}
      <TopBar></TopBar>
      <Container>
        {/*<Button onClick={() => { newUser() }}
          variant="contained" style={{ backgroundColor: '#e0c404', color: 'white', marginBottom: '20px' }}> Create user </Button> */}
        <ImageCard>
          <Typography style={{ fontSize: '50px', color: 'white', fontWeight: 'bold', paddingTop: '90px' }}>
            Your <u>adventure</u> starts here.
          </Typography>
          <CreateTrip></CreateTrip>
        </ImageCard>
      </Container>
    </div>
  );
}
