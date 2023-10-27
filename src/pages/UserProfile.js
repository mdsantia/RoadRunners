import React, { useEffect } from 'react';
import { Container, Typography, AppBar, createTheme, ThemeProvider, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/additionalFeatures/TopBar';
import SideBar, { pageOptions } from '../components/userProfile/SideBar';
import PreferencesForm from '../components/userProfile/PreferencesForm';
import UserTrips from '../components/userProfile/UserTrips';
import VehiclesForm from '../components/userProfile/VehicleInfo';
import PreferencesInfo from '../components/userProfile/PreferencesInfo';


const UserProfile = () => {
  const id = useParams().id;
  const { user, updateUser } = useUserContext();
  const pageType = useParams().pageType;
  const [isEditingPreferences, setIsEditingPreferences] = React.useState(false);
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

  const handleEdit = () => {
    setIsEditingPreferences(true);
  }

  useEffect(() => {
    setIsEditingPreferences(false);
  }, [pageType])

  const getContainer = () => {
    switch (pageType) {
      case pageOptions[0]: // Account
        return <Container></Container>;
      case pageOptions[1]: // Trip Preferences
        return (
          <Container maxWidth="xl">
            {isEditingPreferences ? (
              <PreferencesForm 
                showSaveButton={true} 
                showCancelButton={true} 
                showSkipButton={false} 
                showLogo={false}
                handleSave={() => {
                  setIsEditingPreferences(false);
                  showMessage('Your preferences have been updated!', 2000, 'success');
                }}
                handleCancel={() => setIsEditingPreferences(false)}
              />
            ) : (
              <PreferencesInfo handleEdit={handleEdit}/>
            )}
          </Container>
        );
      case pageOptions[2]: // Vehicles
        return (
          <Container maxWidth="xl">
            <VehiclesForm />
          </Container>
        );
      case pageOptions[3]: // Trip History
        if (user && user.trips.length > 0) {
          return (
            <Container maxWidth="xl">
              <UserTrips user={user} updateUser={updateUser}/>
            </Container>
          );
        }
        return (
          <Container maxWidth="xl">
            <Typography variant="h5">No trips yet!</Typography>
            <a href={`/`}><Typography variant="h6">Create trips to get started.</Typography></a>
          </Container>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user && user._id !== id) {
      window.location.href = "/";
    }
  }, [user, id]);

  return (
    <>
    <TopBar />
    <SideBar pageType={pageType} container={getContainer()}/>
    <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
      <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
        {snackbarMessage}
      </MuiAlert>
    </Snackbar> 
    </>
  );
};

export default UserProfile;