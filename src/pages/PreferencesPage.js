import { React, useEffect } from 'react';
import { Card, Button, Typography, AppBar, Drawer, Grid, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import image from '../assets/login-bg.jpg';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/TopBar';
import NavBar from '../components/SideBar';
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

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column'
});

export default function PreferencesPage() {
  const id = useParams().id;
  const {user} = useUserContext();

  useEffect(() => {
    if (!user) {
      return (<div>Loading...</div>);
    }
    if (user._id !== id) {
      window.location.href = "/";
    }
  }, [user]);
  
  return (
    <ThemeProvider theme={theme}>
      <AppBar><TopBar/></AppBar>
      <Grid>
        <NavBar/> 
      </Grid>
      <Grid>
        <Container>
          <PreferencesForm showSkipButton={false} showDoneButton={true}/>
        </Container>
      </Grid>
    </ThemeProvider>
  );
}