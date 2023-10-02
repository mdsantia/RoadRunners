import React from 'react';
import { useState } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Fab from '@mui/material/Fab';
import AddressSearch from './AddressSearch';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const StyledCard = styled(Card)({
  width: 1000,
  margin: 'auto',
  padding: 20,
  marginTop: 20,
  textAlign: 'center',
  borderRadius: 20,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});


export default function HomePage() {

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <StyledCard>
      <Stack direction="row" spacing={2}>
        <AddressSearch label="Start Location" onInputChange={(value) => setStartLocation(value)}></AddressSearch>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Start Date" onChange={(value) => setStartDate(value.format())} />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker label="End Date" onChange={(value) => setEndDate(value.format())} />
        </LocalizationProvider>
        <AddressSearch label="End Location" onInputChange={(value) => setEndLocation(value)}></AddressSearch>
        <Fab aria-label="delete" style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white' }}>
          <SearchIcon />
        </Fab>
      </Stack>
    </StyledCard>
  );
}
