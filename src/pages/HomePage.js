import React from 'react';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg'
import bg from '../assets/topography-bg.jpg'
import axios from 'axios';
import CreateTrip from '../components/CreateTrip'
import TopBar from '../components/TopBar';
import VehicleForm from '../pages/VehicleForm';
import PreferencesForm from '../pages/PreferencesForm';



const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column',
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
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', height: '100vh'}}>
      <div style={{
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    filter: 'blur(7px)',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  }}></div>
      <PreferencesForm></PreferencesForm>
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
