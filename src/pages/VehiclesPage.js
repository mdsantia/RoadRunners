import { React, useEffect } from 'react';
import { Card, Button, Typography, AppBar, Drawer, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import image from '../assets/login-bg.jpg';
import axios from 'axios';
import TopBar from '../components/TopBar';
import NavBar from '../components/SideBar';
import { useUserContext } from '../hooks/useUserContext';
import { useParams } from 'react-router-dom';
import UserProfile from '../pages/UserProfile';
import CreateTrip from '../components/CreateTrip';

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80vh',
  flexDirection: 'column'
});

const ImageCard = styled(Card)({
    position: 'static',
    maxWidth: 2000,
    width: 1200,
    padding: 5,
    height: 500,
    borderRadius: 25,
    backgroundImage: `url(${image})`,
    backgroundSize: 'cover',
    align: 'center'
  });

export default function VehiclesPage() {
  const id = useParams().id;
  const {user} = useUserContext();

  useEffect(() => {
    if (!user) {
      return;
    }
    if (user._id !== id) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div>
      <AppBar><TopBar /></AppBar>
      <Container><NavBar /></Container>
    </div>
  );
}