import React from 'react';
import axios from 'axios';
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
import {useDirectionContext} from '../../hooks/useDirectionContext';
import {useUserContext} from '../../hooks/useUserContext';
import {useTripContext} from '../../hooks/useTripContext';
import dayjs from 'dayjs';

const StyledCard = styled(Card)({
  width: 1000,
  margin: 'auto',
  padding: 20,
  marginTop: 20,
  textAlign: 'center',
  borderRadius: 20,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Background color with slight transparency
  backdropFilter: 'blur(5px)', // Apply blur effect to the background
});

export default function HomePage() {
  const navigate = useNavigate();
  const {user} = useUserContext
  const {tripDetails} = useTripContext();
  const { setDirections, directionsCallback } = useDirectionContext();

  const [startLocation, setStartLocation] = useState(tripDetails.startLocation?tripDetails.startLocation:null);
  const [endLocation, setEndLocation] = useState(tripDetails.endLocation?tripDetails.endLocation:null);
  const [startDate, setStartDate] = useState(tripDetails.startDate?dayjs(tripDetails.startDate):null);
  const [endDate, setEndDate] = useState(tripDetails.endDate?dayjs(tripDetails.endDate):null);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);

  const handleSubmit= (event) => {
      //call controller method to create trip
      //redirect to dashboard on success
      if(startLocation != null && endLocation != null && startDate != null && endDate != null){
        const tripDetails = {
          startLocation: startLocation,
          endLocation: endLocation,
          startDate: startDate,
          endDate: endDate,
          preferences: user.preferences,
        }
        const encodedTripDetails = btoa(JSON.stringify({tripDetails}));
        navigate(`/dashboard/${encodedTripDetails}`);
        window.location.reload();
      } else{
        console.log("invalid");
        setShouldDisplayWarning(true);
      }
  }

  return (
    <StyledCard>
      <Stack direction="row" spacing={2}>
        <AddressSearch label="Start Location" initial={startLocation} onInputChange={(value) => setStartLocation(value)}></AddressSearch>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" value={startDate} onChange={(value) => setStartDate(value.format())} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="End Date" value={endDate} onChange={(value) => setEndDate(value.format())} />
        </LocalizationProvider>
        <AddressSearch label="End Location" initial={endLocation} onInputChange={(value) => setEndLocation(value)}></AddressSearch>
        <Fab aria-label="delete" style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white' }} onClick={handleSubmit}>
          <SearchIcon />
        </Fab>
      </Stack>
    
    </StyledCard>
  );
}

