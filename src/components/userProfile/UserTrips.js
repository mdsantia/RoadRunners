import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const UserTrips = ({ user }) => {
    const navigate = useNavigate();

    const handleTripClick = (trip) => {
        navigate(`/dashboard/${trip.hash}`);
        window.location.reload();
    }

    return (
        <>
            <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Trip History</Typography>
            <Grid container spacing={2}>
                {user.trips.map((trip) => {
                    const tripDetails = JSON.parse(atob(trip.hash)).tripDetails; // Decode the trip.hash
                    console.log(tripDetails);
                    return (
                        <Grid item xs={12} sm={6} md={4} key={trip.id}>
                            <Button style={{ textDecoration: 'none' }} onClick={() => handleTripClick(trip)}>
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
