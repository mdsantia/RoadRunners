import React from 'react';
import { Card, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg'
import axios from 'axios'
import CreateTrip from '../components/CreateTrip'
import TopBar from '../components/TopBar';
import TextRotator from '../components/TextRotator';


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
  borderRadius: 15,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
});


const StyledButton = styled(Button)({
  marginBottom: 10,
})

const newUser = () => {
  axios.post('http://localhost:5010/api/user/newUser')
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
      <TopBar></TopBar>
      <Container>
        {/*<Button onClick={() => { newUser() }}
          variant="contained" style={{ backgroundColor: '#e0c404', color: 'white', marginBottom: '20px' }}> Create user </Button> */}
        <ImageCard>
          <TextRotator></TextRotator>
          <CreateTrip></CreateTrip>
        </ImageCard>
      </Container>
    </div>
  );
}
