import React, { useEffect } from 'react';
import { Container, Button, Typography, AppBar, Drawer, Grid, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import image from '../assets/login-bg.jpg';
import axios from 'axios';
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

const SidebarContainer = styled('div')({
  width: '25%',
});

const ContentContainer = styled('div')({
  flex: 1,
  padding: '100px',
  paddingTop: '80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
});

export default function UserProfile() {
  const id = useParams().id;
  const {user} = useUserContext();
  const pageType = useParams().pageType;

  function getContainer() {
    if (pageType === pageOptions[0]) { // Account info
      return (
        <Container></Container>
      )
    }
    if (pageType === pageOptions[1]) { // Trip Preferences
      return (
        <PreferencesForm showSkipButton={false} showDoneButton={true} showLogo={false}/>
      )
    }
    if (pageType === pageOptions[2]) { // Vehicles
      return (
        <VehiclesForm/>
      )
    }
    if (pageType === pageOptions[3]) {
      if (user && user.trips.length > 0) { // Trip History
        return (
          <>  
            <UserTrips user={user}/>
          </>
        )
      }
      return (
        <>
          <Container paddingTop={20}>
          <Typography variant="h5" >No trips yet!</Typography>
          <a href={`/`}>  <Typography variant="h6">Create trips to get started.</Typography> </a>
          </Container>
        </>
      )
    }
  }

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user._id !== id) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div>
      <AppBar><TopBar/></AppBar>
      <Container>
        <SidebarContainer>
          <SideBar pageType={pageType}/> 
        </SidebarContainer>
        <ContentContainer>
          {getContainer()}
        </ContentContainer>
      </Container>    
    </div>
  );
}