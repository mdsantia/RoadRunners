import React from 'react';
import { useState } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';


const StyledCard = styled(Card)({
  width: 1000,
  margin: 'auto',
  padding: 20,
  marginTop: 20,
  textAlign: 'center',
  borderRadius: 20,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});


export default function Itinerary() {

  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [shouldDisplayWarning, setShouldDisplayWarning] = useState(false);
  const navigate = useNavigate();


  return (
    <StyledCard>
      
    
    </StyledCard>
  );
}


