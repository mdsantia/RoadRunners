import { React, useEffect, useState} from 'react';
import { Card, CardContent, Typography, Button, IconButton, Link, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../components/iconify';

import Logo from '../assets/rr-logo.png'
import image from '../assets/login-bg.jpg'
import jwt_decode from "jwt-decode";


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
  const [user, setUser] = useState({});

  const clientID = "766899819559-91ms2mv2gtmksi22fbf605k6a4bf1okv.apps.googleusercontent.com";

  const handleGoogleSignIn = (response) => {
    // Implement Google Sign In Logic here
    console.log("Encoded JWT ID Token:" + response.credential + "\nDECODED: ");
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    setUser(userObject);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: clientID,
      callback: handleGoogleSignIn
    });
    
    /* global google */
    google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        {   theme: "outline", size: "large"}
    );
  }, []);

  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <Container>
        <StyledCard>
          <CardContent>
            <img src={Logo} alt="Logo" width={400} />
            <br></br>
            <StyledButton>
              {/* <Button variant="outlined" startIcon={<Iconify icon="eva:google-fill" color="#DF3E30" width={30} height={30} />}>
              Sign in with Google
              </Button> */}
              <div id="signInDiv"></div>
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
