import React from 'react';
import { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddressSearch from './AddressSearch';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import {useDashboardContext} from '../../hooks/useDashboardContext';
import {useUserContext} from '../../hooks/useUserContext';
import { useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import LZString from 'lz-string';

const StyledCard = styled(Card)(({ theme }) => ({
  width: "80%",
  margin: 'auto',
  padding: 20,
  marginTop: 20,
  textAlign: 'center',
  borderRadius: 20,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Background color with slight transparency
  backdropFilter: 'blur(5px)', // Apply blur effect to the background
  [theme.breakpoints.down('sm')]: {
    width:'55%',
  },
  [theme.breakpoints.down('md')]: {
    width:'55%',
  },
  
}));

export default function CreateTrip() {
  const navigate = useNavigate();
  const {user} = useUserContext();
  const {tripDetails} = useDashboardContext();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [startLocation, setStartLocation] = useState(tripDetails?tripDetails.startLocation:null);
  const [endLocation, setEndLocation] = useState(tripDetails?tripDetails.endLocation:null);
  const [startDate, setStartDate] = useState(tripDetails?dayjs(tripDetails.startDate):null);
  const [endDate, setEndDate] = useState(tripDetails?dayjs(tripDetails.endDate):null);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);

  useEffect(() => {
    if (tripDetails) {
      setStartLocation(tripDetails.startLocation);
      setEndLocation(tripDetails.endLocation);
      setStartDate(dayjs(tripDetails.startDate));
      setEndDate(dayjs(tripDetails.endDate));
    }
  }, [tripDetails]);
  

  const handleSubmit= (event) => {
      //call controller method to create trip
      //redirect to dashboard on success
      if(startLocation !== null && endLocation !== null && startDate !== null && endDate !== null){
        let selectedVehicles = [];
        let numVehicles = 0;
        let vehicle = null;
        if (user) {
          if (user.vehicles.length > 0) {
            numVehicles = 1;
            vehicle = user.vehicles[0];
            selectedVehicles.push(`${vehicle.color} ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
          }
        }
        const tripDetails = {
          id: null,
          startLocation: startLocation,
          endLocation: endLocation,
          startDate: startDate,
          endDate: endDate,
          preferences: user ? user.preferences : null,
          numVehicles: numVehicles,
          selectedVehicles: selectedVehicles,
        }
        const encodedTripDetails = btoa(JSON.stringify({tripDetails: tripDetails}));
        navigate(`/dashboard/${encodedTripDetails}`);
        // window.location.reload();
      } else{
        console.log("invalid");
        setShouldDisplayWarning(true);
      }
  }

  return (
    <StyledCard>
      <Stack direction={isSmallScreen ? 'column' : 'row'}  spacing={2}>
        <AddressSearch label="Start Location" onInputChange={(value) => setStartLocation(value)}></AddressSearch>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" value={startDate} onChange={(value) => setStartDate(value.format())} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="End Date" value={endDate} onChange={(value) => setEndDate(value.format())} />
        </LocalizationProvider>
        <AddressSearch label="End Location" onInputChange={(value) => setEndLocation(value)}></AddressSearch>
        <Fab aria-label="delete" style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white' }} onClick={handleSubmit}>
          <SearchIcon />
        </Fab>
      </Stack>
    
    </StyledCard>
  );
}

