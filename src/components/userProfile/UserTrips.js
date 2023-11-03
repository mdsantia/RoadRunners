import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { styled } from '@mui/material/styles';


const VerticalTripCard = styled(Card)(({ theme }) => ({
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #ccc',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    flexDirection: 'column',
    display: 'flex',
}));

const CardContentNoPadding = styled(CardContent)(`
  padding: 10px;
  &:last-child {
    padding-bottom: 10px;
  }
`);

const UserTrips = ({ user, updateUser }) => {
    const navigate = useNavigate();

    const handleTripClick = async (trip) => {
        navigate(`/dashboard/${trip.hash}`);
    }

    const handleDeleteTrip = async (tripid, event) => {
        event.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmed) {
            // User clicked "Cancel," do nothing
            event.stopPropagation();
            return;
        }
        await axios.post('/api/user/deleteTrip', {
            email: user.email,
            id: tripid
        }).then((response) => {
            const newUser = response.data;
            updateUser(newUser);
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleClearTrips = async () => {
        const confirmed = window.confirm("Are you sure you want to clear your trip history?");
        if (!confirmed) {
            return;
        }
        await axios.post('/api/user/clearTrips', {
            email: user.email,
        }).then((response) => {
            const newUser = response.data;
            updateUser(newUser);
        }).catch((error) => {
            console.log(error);
        });
    }

    const getTripInfo = (infoLabel, info) => {
        return (
            <Grid container alignItems="left" textAlign="left" spacing={0}>
                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontWeight: 'bold' }}>
                        {infoLabel}
                    </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                        {info}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Trip History</Typography>
            <Button style={{ textDecoration: 'none' }} onClick={handleClearTrips}> 
                <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', cursor:'pointer' }}>Clear All</Typography>
            </Button>
            {/* <Grid container spacing={2}> */}
                {user.trips.map((trip) => {
                    const tripDetails = JSON.parse(atob(trip.hash)).tripDetails // Decode the trip.hash
                    return (
                        <Grid container key={trip._id} alignItems="center" justify="center">
                            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                                <Button style={{ textDecoration: 'none', padding: '5px', width: '100%' }} onClick={() => handleTripClick(trip)}>
                                    <VerticalTripCard
                                        sx={{
                                            minWidth: '250',
                                            backgroundColor: '#f5f5f5',
                                        }}
                                    >
                                        <CardContentNoPadding>
                                            {getTripInfo("Origin:", tripDetails.startLocation)}
                                            {getTripInfo("Destination:", tripDetails.endLocation)}
                                            <Divider />
                                            {getTripInfo("From:", new Date(tripDetails.startDate).toLocaleDateString())}
                                            {getTripInfo("To:", new Date(tripDetails.endDate).toLocaleDateString())}
                                        </CardContentNoPadding>
                                    </VerticalTripCard>
                                </Button>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                <Button onClick={(event) => handleDeleteTrip(tripDetails.id, event)}>
                                    <VerticalTripCard sx={{ minWidth: '250', backgroundColor: '#f5f5f5' }}>
                                        <CardContentNoPadding alignItems="center">
                                            <DeleteForeverIcon style={{ fontSize: '30px', cursor: 'pointer', color: 'black' }}/>
                                        </CardContentNoPadding>
                                    </VerticalTripCard>
                                </Button>
                            </Grid>
                        </Grid>
                    );
                })}
            {/* </Grid> */}
        </>
    );
};

export default UserTrips;
