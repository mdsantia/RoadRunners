import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  AppBar,
  Grid,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import VehicleForm from '../components/VehicleForm';
import CarRanking from '../components/CarRanking';

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
        <AppBar>
          <TopBar />
        </AppBar>
        <Container>
          <Grid container>
            {/* Left Sidebar */}
            <Grid item xs={2} sm={0} md={1}>
              <SidebarContainer>
                <SideBar />
              </SidebarContainer>
            </Grid>
            {/* Middle Content (VehicleForm) */}
            <Grid item xs={12} sm={1} md={8}>
              <ContentContainer>
                <VehicleForm
                  showSkipButton={false}
                  showDoneButton={true}
                  showLogo={false}
                />
              </ContentContainer>
            </Grid>
            {/* Right Content (Draggable_EX) */}
            <Grid item xs={12} sm={4} md={1}>
              <ContentContainer>
                <CarRanking />
              </ContentContainer>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}
