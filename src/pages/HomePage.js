import React from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';



const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});

const StyledCard = styled(Card)({
  width:800,
  margin: 'auto',
  padding: 20,
  textAlign: 'center',
  borderRadius:60,
});

const backgroundCard = styled(Card)({
    width:900,
    margin: 'auto',
    padding: 20,
    textAlign: 'center',
    borderRadius:60,
  });


const fieldCard = styled(Card)({
    paddingRight:10,
})


const StyledButton = styled(Button)({
   marginBottom:10,
})

export default function HomePage() {


  return (
    <div style={{backgroundColor:'#00455A', height:'100vh'}}>
      <Container>
              <StyledCard>
                  <TextField id="standard-basic" label="Starting Location" variant="standard" />
                  <TextField id="standard-basic" label="Start Date" variant="standard" />
                  <TextField id="standard-basic" label="End Date" variant="standard" />
                  <TextField id="standard-basic" label="Destination" variant="standard" />
              </StyledCard>



    </Container>
    </div>
  );
}
