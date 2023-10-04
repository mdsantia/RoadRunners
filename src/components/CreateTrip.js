import React from 'react';
import axios from 'axios';
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
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import dayjs from 'dayjs';


const StyledCard = styled(Card)({
  width: 1000,
  margin: 'auto',
  padding: 20,
  marginTop: 20,
  textAlign: 'center',
  borderRadius: 20,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});


export default function HomePage(props) {
  const navigate = useNavigate();

  const [startLocation, setStartLocation] = useState(props.startLocation?props.startLocation:null);
  const [endLocation, setEndLocation] = useState(props.endLocation?props.endLocation:null);
  const [startDate, setStartDate] = useState(props.startDate?dayjs(props.startDate):null);
  const [endDate, setEndDate] = useState(props.endDate?dayjs(props.endDate):null);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);

  const [directionsResponse, setDirectionsResponse] = useState(null);

  const buildRoadTrip = () => {
      axios
        .get('/api/roadtrip/newRoadTrip')
        .then((res) => {
          console.log(res);
          setDirectionsResponse(res.data); // Use res.data to set the directionsResponse
        })
        .catch((err) => {
          console.log(err);
        });
    };

  const handleSubmit= (event) => {
      //call controller method to create trip
      //redirect to dashboard on success
      if(startLocation != null && endLocation != null && startDate != null && endDate != null){
        console.log("redirecting");
        console.log("Starting Location:" ,startLocation);
        console.log("Ending Location:", endLocation);
        navigate(`/dashboard/${startLocation}/${endLocation}/${startDate}/${endDate}`);
        buildRoadTrip();
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


