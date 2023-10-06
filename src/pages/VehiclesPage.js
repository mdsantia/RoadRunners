import React, { useEffect } from 'react';
import { Container, Typography, AppBar, Grid, createTheme, ThemeProvider } from '@mui/material';
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
  width: '10%',
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

export default function VehiclesPage() {
  const id = useParams().id;
  const {user} = useUserContext();
  const [selectedCar, setSelectedCar] = React.useState(null);
  
  const handleSelectCar = (car) => {
    setSelectedCar(car);
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
      <ThemeProvider theme={theme}>
        <AppBar>
          <TopBar />
        </AppBar>
        <Container>
          {/* Left Sidebar */}
          <SidebarContainer>
            <SideBar />
          </SidebarContainer>
          <Grid container spacing={32}>
            {/* Middle Content (VehicleForm) */}
            <Grid item xs={12} sm={6} md={6}>
              <ContentContainer>
                <VehicleForm
                  showAddButton={true}
                  showLogo={false}
                  selectedCar={selectedCar}
                />
              </ContentContainer>
            </Grid>
            {/* Right Content (Draggable_EX) */}
            <Grid item xs={12} sm={6} md={6}>
              <ContentContainer>
                <CarRanking onSelectCar={handleSelectCar}/>
              </ContentContainer>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </div>
  );
}
