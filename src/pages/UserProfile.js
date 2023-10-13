import React, { useEffect } from 'react';
import { Container, Typography, AppBar, createTheme, ThemeProvider } from '@mui/material';
import { useParams } from "react-router-dom";
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/additionalFeatures/TopBar';
import SideBar, { pageOptions } from '../components/userProfile/SideBar';
import PreferencesForm from '../components/userProfile/PreferencesForm';
import UserTrips from '../components/userProfile/UserTrips';
import VehiclesForm from '../components/userProfile/VehiclesForm';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

const UserProfile = () => {
  const id = useParams().id;
  const { user } = useUserContext();
  const pageType = useParams().pageType;

  const getContainer = () => {
    switch (pageType) {
      case pageOptions[0]: // Account Information
        return <Container></Container>;
      case pageOptions[1]: // Trip Preferences
        return (
          <Container sx={{paddingTop: '90px', marginLeft: '100px'}}>
            <PreferencesForm showSkipButton={false} showDoneButton={true} showLogo={false} />;
          </Container>
        );
      case pageOptions[2]: // Vehicles
        return (
          <Container sx={{paddingTop: '90px', marginLeft: '100px'}}>
            <VehiclesForm />
          </Container>
        );
      case pageOptions[3]: // Trip History
        if (user && user.trips.length > 0) {
          return (
            <Container sx={{paddingTop: '90px', marginLeft: '100px'}}>
              <UserTrips user={user} />
            </Container>
          );
        }
        return (
          <Container sx={{paddingTop: '90px', marginLeft: '100px'}}>
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
    <ThemeProvider theme={theme}>
      <div>
        <AppBar>
          <TopBar />
        </AppBar>
        <Container>
          <SideBar pageType={pageType} />
          {getContainer()}
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default UserProfile;