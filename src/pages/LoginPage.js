import { React, useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useUserContext } from '../hooks/useUserContext';
import { AccountsClientID } from '../Constants';

import Logo from '../assets/rr-logo.png';
import image from '../assets/login-bg.jpg';
import TopBar from '../components/additionalFeatures/TopBar';

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
});

export default function LoginPage() {
  const {user, setUser, logout } = useUserContext();

  const handleGoogleSignIn = async (response) => {
    // Implement Google Sign In Logic here
    console.log("Encoded JWT ID Token:" + response.credential + "\nDECODED: ");
    var userObject = jwt_decode(response.credential);
    const email = userObject.email;
    const name = userObject.name;
    const google_id = userObject.sub;
    const google_expiry = userObject.exp;
    const profile_picture = userObject.picture;
    await axios.post('/api/user/checkAndSaveUser', {
      name: name,
      email: email,
      google_id: google_id,
      google_expiry: google_expiry,
      profile_picture: profile_picture
    }).then((res) => {
      setUser(res.data.user);
      const firstLogin = res.data.firstTime;
      window.location.href = firstLogin ? "/?firstLogin=true" : "/";
    }).catch((err) => {
      console.log(err);
    });
  };

  useEffect(() => {
    // Load the Google Sign-In script when the component mounts
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: AccountsClientID,    
        callback: handleGoogleSignIn
      });

      google.accounts.id.renderButton(
        document.getElementById("signInDiv"),
        { theme: "outline", size: "large" }
      );
    };

    document.head.appendChild(script);

    // Cleanup when the component unmounts
    return () => {
      // Remove the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };


  return (
    <div style={{ backgroundColor: 'white', height: '100vh' }}>
      <TopBar></TopBar>
      <Container>
        <StyledCard>
          <CardContent>
            <img src={Logo} alt="Logo" width={400} />
            <br></br>
            {user ? ( 
              <div>
                <Typography variant="body1" color="textPrimary">
                  You are already signed in as {user.name}.
                </Typography>
                <Button onClick={handleLogout}>Log out</Button>
              </div>
            ) : (
              <div>
                <StyledButton>
                  <div id="signInDiv"></div>
                </StyledButton>
                <br></br>
                <Typography component="a" href="https://accounts.google.com/signup/v2/createaccount?theme=glif&flowName=GlifWebSignIn&flowEntry=SignUp" target="_blank" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                  Don't have an account?
                </Typography>
              </div>
            )}
          </CardContent>
        </StyledCard>
      </Container>
    </div>
  );
}
