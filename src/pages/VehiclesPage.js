import { React, useEffect } from 'react';
import { Container, Button, Typography, AppBar, Drawer, Grid, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import image from '../assets/login-bg.jpg';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import VehicleForm from '../components/VehicleForm';


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
  flex: 1, // This makes the content expand to take up available space horizontally
  padding: '100px',
  paddingTop: '80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start', // Align children to the left
  width: '100%', // Ensure it takes up 100% of the available width
});

export default function VehiclesPage() {
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
    <div>
      <ThemeProvider theme={theme}>
      <AppBar><TopBar/></AppBar>
      <Container>
        <SidebarContainer>
          <SideBar/> 
        </SidebarContainer>
        <ContentContainer>
          <VehicleForm/>
        </ContentContainer>
      </Container>
    </ThemeProvider>
    </div>
  );
}