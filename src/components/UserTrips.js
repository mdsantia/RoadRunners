import React from 'react';
import {useNavigate} from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';

const UserTrips = ({ user }) => {
    const navigate = useNavigate();

    const handleTripClick = (trip) => {
        navigate(`/dashboard/${trip.origin}/${trip.destination}/${trip.startDate}/${trip.endDate}`);
        window.location.reload();
    }
  return (
    <>
    <Typography style={{ padding: '20px', margin: '0', fontSize: '25px', fontWeight: 'bold'}}>Trip History</Typography>
    <Grid container spacing={2}>
      {user.trips.map((trip) => (
        <Grid item xs={12} sm={6} md={4} key={trip.id}>
            <Button style={{textDecoration: 'none'}} onClick={() => handleTripClick(trip)} >
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
                        {trip.origin} - {trip.destination}
                        </Typography>
                        <Typography
                        style={{
                            fontSize: '14px',
                            color: '#555',
                        }}
                        >
                        Origin: {trip.origin}
                        <br />
                        Destination: {trip.destination}
                        </Typography>
                        <Typography
                        style={{
                            fontSize: '14px',
                            color: '#555',
                            fontWeight: 'bold',
                        }}
                        >
                        {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
                        </Typography>
                    </CardContent>
                </Card>
            </Button>
        </Grid>
      ))}
    </Grid>
    </>
  );
};

export default UserTrips;
