import React from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import image from '../assets/login-bg.jpg'
import Logo from '../assets/roadrunner-logo.png'



const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  flexDirection:'column'
});

const StyledCard = styled(Card)({
  width:800,
  margin: 'auto',
  padding: 14,
  marginTop:150,
  textAlign: 'center',
  borderRadius:60,
});




const ImageCard = styled(Card)({
    maxWidth:2000,
    width:1200,
    padding: 5,
    height:500,
    borderRadius:15,
  });

const StyledButton = styled(Button)({
   marginBottom:10,
})

export default function HomePage() {


  return (
    <div style={{backgroundColor:'#00455A', height:'100vh'}}>
      <Container>
      <img src={Logo} style={{justifyContent:'left'}}alt="Logo" width={300}/>
            <ImageCard>
              <StyledCard>
                  <TextField id="standard-basic" label="Starting Location" variant="standard" />
                  <TextField id="standard-basic" label="Start Date" variant="standard" />
                  <TextField id="standard-basic" label="End Date" variant="standard" />
                  <TextField id="standard-basic" label="Destination" variant="standard" />
                  <IconButton aria-label="delete" style={{marginTop:'10px', marginLeft:'20px', backgroundColor:'#e0c404', color:'white'}}> 
                      <SearchIcon fontsize="large"/>
                  </IconButton>
              </StyledCard>
              </ImageCard>
    </Container>
    </div>
  );
}
