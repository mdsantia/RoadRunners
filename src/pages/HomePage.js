import React from 'react';
import { Card, Button, Typography, Dialog, DialogContent, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg'
import bg from '../assets/topography-bg.jpg'
import axios from 'axios';
import CreateTrip from '../components/newTrip/CreateTrip'
import TopBar from '../components/additionalFeatures/TopBar';
import PreferencesForm from '../components/userProfile/PreferencesForm';
import { useUserContext } from '../hooks/useUserContext';


const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column',
  marginTop: '75px',
});

const ResponsiveTypographyWrapper = styled('div')(({ theme }) => ({
  textAlign: 'center',
  fontSize: '50px',
  color: 'white',
  fontWeight: 'bold',
  paddingTop: '90px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '30px',
    paddingTop: '60px',
    textAlign:'center',
  },
}));
const ImageCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  maxWidth: 2000,
  width: '80%',
  padding: 5,
  height: '58%',
  borderRadius: 25,
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  [theme.breakpoints.down('sm')]: {
   width:'90%',
   height:'90%'
  },
}));

const StyledButton = styled(Button)({
  marginBottom: 10,
})

export default function HomePage() {
  const [preferencesOpen, setPreferencesOpen] = React.useState(true);
  const urlParams = new URLSearchParams(window.location.search);
  const firstLogin = urlParams.get('firstLogin');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarDuration, setSnackbarDuration] = React.useState(2000);
  const showMessage = (message, duration, severity) => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarDuration(duration);
      setSnackbarOpen(true);
  };
  const closeSnackbar = () => {
      setSnackbarOpen(false);
  };

  const handleClosePreferences = () => {
    setPreferencesOpen(false);
    showMessage('Your preferences have been saved!', 2000, 'success')
  }

  const { user } = useUserContext();
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', height: '100%'}}>
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
              <DialogContent sx={{ padding: '20px' }}>
                <PreferencesForm showSkipButton={true} showSaveButton={true} showLogo={true} onClose={handleClosePreferences}></PreferencesForm>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
      <TopBar></TopBar>
      <Container>
        {/*<Button onClick={() => { newUser() }}
          variant="contained" style={{ backgroundColor: '#e0c404', color: 'white', marginBottom: '20px' }}> Create user </Button> */}
        <ImageCard>
     
        <ResponsiveTypographyWrapper>
     
        Your <u>adventure</u> starts here.
      
    </ResponsiveTypographyWrapper>
       
          <CreateTrip></CreateTrip>
        </ImageCard>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
