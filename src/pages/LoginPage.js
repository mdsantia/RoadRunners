import React from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../components/iconify';
import Logo from '../assets/roadrunner-updated-logo.png'
import image from '../assets/login-bg.jpg'

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
});

const StyledCard = styled(Card)({
  maxWidth: 500,
  margin: 'auto',
  padding: 20,
  textAlign: 'center',
  borderRadius: 10,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
});



const StyledButton = styled(Button)({
  marginBottom: 10,
})

export default function LoginPage() {
  const handleGoogleSignIn = () => {
    // Implement Google Sign In Logic here
  };

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Container>
        <StyledCard>
          <CardContent>
            <img src={Logo} alt="Logo" width={400} />
            <br></br>
            <StyledButton>
              <Button variant="outlined" startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={30} height={30} />}>
                Sign in with Google
              </Button>
            </StyledButton>
            <br></br>
            <Typography component="a" href="https://accounts.google.com/signup/v2/createaccount?theme=glif&flowName=GlifWebSignIn&flowEntry=SignUp" target="_blank" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </CardContent>
        </StyledCard>
      </Container>
    </div>
  );
}
