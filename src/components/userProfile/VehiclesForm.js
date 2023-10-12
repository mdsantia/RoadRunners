import React, { useEffect } from 'react';
import { Container, Typography, AppBar, Grid, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../../hooks/useUserContext';
import VehicleInfo from '../additionalFeatures/VehicleInfo';
import CarRanking from '../additionalFeatures/CarRanking';

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

const ContentContainer = styled('div')({
  flex: 1,
  padding: '20px',
  paddingTop: '10px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
});

export default function VehiclesForm() {
  const [selectedCar, setSelectedCar] = React.useState(null);
  
  const handleSelectCar = (car) => {
    setSelectedCar(car);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={50}>
        {/* Middle Content (VehicleForm) */}
        <Grid item xs={12} sm={6} md={6}>
          <ContentContainer>
            <VehicleInfo
              showAddButton={true}
              showLogo={false}
              selectedCar={selectedCar}
              onSelectCar={handleSelectCar}
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
    </ThemeProvider>
  );
}