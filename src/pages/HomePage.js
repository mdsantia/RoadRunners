import React from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import image from '../assets/login-bg.jpg'
import Logo from '../assets/roadrunner-logo-clear.png'
import Fab from '@mui/material/Fab';
import axios from 'axios'

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
    position: 'relative',
    maxWidth: 2000,
    width: 1200,
    padding: 5,
    height: 500,
    borderRadius: 15,

    
  });


const StyledButton = styled(Button)({
   marginBottom:10,
})

const newUser = () => {
  axios.post('http://localhost:5010/api/user/newUser')
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
}

export default function HomePage() {

  return (
    <div style={{backgroundColor:'#00455A', height:'100vh'}}>
      <Container>
        <Button onClick={() => { newUser() }}
        variant="contained" style={{backgroundColor:'#e0c404', color:'white', marginBottom:'20px'}}> Create user </Button>
      <img src={Logo} alt="Logo" width={300} style={{ position: 'absolute', top: '6px', left: '20px' }} />
            <ImageCard style={{}}>
              <StyledCard>
                  <TextField id="standard-basic" label="Starting Location" variant="standard" />
                  <TextField id="standard-basic" label="Start Date" variant="standard" />
                  <TextField id="standard-basic" label="End Date" variant="standard" />
                  <TextField id="standard-basic" label="Destination" variant="standard" />
                  <Fab aria-label="delete" style={{marginTop:'10px', marginLeft:'20px', backgroundColor:'#e0c404', color:'white'}}> 
                      <SearchIcon/>
                  </Fab>
              </StyledCard>
              </ImageCard>
    </Container>
    </div>
  );
}
