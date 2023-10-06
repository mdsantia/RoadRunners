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
import { useUserContext } from '../hooks/useUserContext';


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

export default function HomePage() {
  const [preferencesOpen, setPreferencesOpen] = React.useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const firstLogin = urlParams.get('firstLogin');
  console.log(firstLogin);

  const handleClosePreferences = () => {
    setPreferencesOpen(false);
  }

  const { user } = useUserContext();
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', height: '100vh'}}>
      <div style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        filter: 'blur(4px)',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
      }}>
      </div>
      {(user && firstLogin) && (
        <div>
          {preferencesOpen && (
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
          {preferencesOpen && (
            <Dialog fullWidth maxWidth="md" open={preferencesOpen} onClose={handleClosePreferences}>
              <PreferencesForm showSkipButton={true} showDoneButton={true} showLogo={true} onClose={handleClosePreferences}></PreferencesForm>
            </Dialog>
          )}
        </div>
      )}
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
