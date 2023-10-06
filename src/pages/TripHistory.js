import { React, useEffect } from 'react';
import { Container, Button, Typography, AppBar, Drawer, Grid, Box, createTheme, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from "react-router-dom";
import { useUserContext } from '../hooks/useUserContext';
import UserTrips from '../components/UserTrips';
import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';

const SidebarContainer = styled('div')({
    width: '25%',
  });
  
  const ContentContainer = styled('div')({
    flex: 1, // This makes the content expand to take up available space horizontally
    padding: '100px',
    paddingTop: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Align children to the left
    width: '100%', // Ensure it takes up 100% of the available width
    radius:10,
  });

export default function TripHistory() {
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
        <>
        <AppBar><TopBar/></AppBar>
        <Container>
            <SidebarContainer>
            <   SideBar/> 
            </SidebarContainer>
            <ContentContainer>
                {user && user.trips.length > 0 ? (
                    <>  
                        <UserTrips user={user}/>
                    </>
                ) : (
                    <>
                      
                        <Container paddingTop={20}>
                        <Typography variant="h5" >No trips yet!</Typography>
                        <a href={`/`}>  <Typography variant="h6">Create trips to get started.</Typography> </a>
                        </Container>
                        
                        
                        
                    </>
                )}
            </ContentContainer>
        </Container>
        </>
    )
}

