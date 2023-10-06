import React from 'react';
import { Card, Button, Typography, Dialog, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg'
import bg from '../assets/topography-bg.jpg'
import axios from 'axios';
import CreateTrip from '../components/CreateTrip'
import TopBar from '../components/TopBar';
import VehicleForm from '../components/VehicleForm';
import PreferencesForm from '../components/PreferencesForm';



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
  const [preferencesOpen, setPreferencesOpen] = React.useState(true);
  const [vehicleOpen, setVehicleOpen] = React.useState(false);

  const handleClosePreferences = () => {
    setPreferencesOpen(false);
    setVehicleOpen(true);
  }

  const handleCloseVehicle = () => {
    setVehicleOpen(false);
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' , backgroundImage:`url(${bg})`, backgroundSize: 'cover',}}>
      {(preferencesOpen || vehicleOpen) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            zIndex: 999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      )}
      <Dialog fullWidth maxWidth="md" open={preferencesOpen} onClose={handleClosePreferences}>
        <PreferencesForm onClose={handleClosePreferences}></PreferencesForm>
      </Dialog>
      <Dialog fullWidth maxWidth="sm" open={vehicleOpen} onClose={handleCloseVehicle}>
        <VehicleForm onClose={handleCloseVehicle}></VehicleForm>
      </Dialog>
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
