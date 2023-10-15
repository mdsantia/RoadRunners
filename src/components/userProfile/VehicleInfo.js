import React, { useEffect } from 'react';
import { Container, Typography, AppBar, Grid, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUserContext } from '../../hooks/useUserContext';
import VehicleInfo from './VehicleForm';
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

export default function VehiclesForm() {
  const [selectedCar, setSelectedCar] = React.useState(null);
  
  const handleSelectCar = (car) => {
    setSelectedCar(car);
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid container> 
        {/* Middle Content (VehicleForm) */}
        <Grid item xs={12} sm={6} md={6}>
            <VehicleInfo
              showAddButton={true}
              selectedCar={selectedCar}
              onSelectCar={handleSelectCar}
              />
        </Grid>
        {/* Right Content (Draggable_EX) */}
        <Grid item xs={12} sm={6} md={6} sx={{ textAlign: 'right' }}>
            <CarRanking onSelectCar={handleSelectCar}/>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}