import { React, useEffect } from 'react';
import { Container, Button, Typography, AppBar, Drawer, Grid, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import image from '../assets/login-bg.jpg';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import PreferencesForm from '../components/PreferencesForm';


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

export default function PreferencesPage() {
  const id = useParams().id;
  const {user} = useUserContext();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user._id !== id) {
      window.location.href = "/";
    }
  }, [user]);
  
  return (
    <ThemeProvider theme={theme}>
      <AppBar><TopBar/></AppBar>
      <Container>
        <SidebarContainer>
          <SideBar/> 
        </SidebarContainer>
        <ContentContainer>
          <PreferencesForm showSkipButton={false} showDoneButton={true} showLogo={false}/>
        </ContentContainer>
      </Container>
    </ThemeProvider>
  );
}