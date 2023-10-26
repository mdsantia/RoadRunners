import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';


const UserTrips = ({ user, updateUser }) => {
    const navigate = useNavigate();

    const handleTripClick = async (hash) => {
        navigate(`/dashboard/${hash}`);
        window.location.reload();
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
        await axios.post('/api/user/clearTrips', {
            email: user.email,
        }).then((response) => {
            const newUser = response.data;
            updateUser(newUser);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <>
            <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Trip History</Typography>
            <Button style={{ textDecoration: 'none' }} onClick={handleClearTrips}> 
                <Typography style={{ fontSize: '15px', fontWeight: 'bold', color: '#555', cursor:'pointer'}}>Clear All</Typography>
            </Button>
            <Grid container spacing={2}>
                {user.trips.map((trip) => {
                    const tripDetails = JSON.parse(atob(trip.hash)).tripDetails; // Decode the trip.hash
                    return (
                        <Grid item xs={12} sm={6} md={4} key={trip._id}>
                            <Button style={{ textDecoration: 'none' }} onClick={() => handleTripClick(trip.hash)}>
                                <Card
                                    style={{
                                        minWidth: 275,
                                        marginBottom: '16px',
                                        backgroundColor: '#f5f5f5',
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            style={{
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                marginBottom: '8px',
                                            }}
                                        >
                                            {tripDetails.startLocation} - {tripDetails.endLocation}
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: '14px',
                                                color: '#555',
                                            }}
                                        >
                                            Origin: {tripDetails.startLocation}
                                            <br />
                                            Destination: {tripDetails.endLocation}
                                        </Typography>
                                        <Typography
                                            style={{
                                                fontSize: '14px',
                                                color: '#555',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {new Date(tripDetails.startDate).toLocaleDateString()} to {new Date(tripDetails.endDate).toLocaleDateString()}
                                        </Typography>
                                        <DeleteForeverIcon style={{ fontSize: '25px', textAlign: 'right', cursor:'pointer'}} onClick={(event) => handleDeleteTrip(tripDetails.id, event)}/>
                                    </CardContent>
                                </Card>
                            </Button>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
};

export default UserTrips;
