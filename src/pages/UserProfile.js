import React from 'react';
import { Card, Button, Typography, AppBar, Drawer } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import image from '../assets/login-bg.jpg';
import axios from 'axios';
import TopBar from '../components/TopBar';
import NavBar from '../components/NavBar';
import { useUserContext } from '../hooks/useUserContext';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column'
});

export default function UserProfile() {
  const id = useParams().id;
  const {user} = useUserContext();
  if (user._id !== id) {
    window.location.href = "/";
  }
  return (
    <div>
        <AppBar>
          <TopBar />
        </AppBar>
        <Container>
          <NavBar />
        </Container>
    </div>
  );
}