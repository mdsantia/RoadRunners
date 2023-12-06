import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Divider, Avatar } from '@mui/material';
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

const SharedTrips = ({user}) => {
    const [trips, setTrips] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            return;
        }
        async function fetchTrips() {
            await axios.get(`/api/trip/getAllSharedTrips/${user.email}`)
                .then((response) => {
                    console.log(response.data);
                    setTrips(response.data);
                }).catch((error) => {
                    console.log(error);
                });
        }
        fetchTrips();
    }, [user]);

    const handleTripClick = (id) => {
        navigate(`/dashboard/${id}`);
    }

    const getTripInfo = (infoLabel, info) => {
        return (
            <Grid container alignitems="left" textAlign="left" spacing={0}>
                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontWeight: 'bold' }}>
                        {infoLabel}
                    </Typography>
                </Grid>
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontStyle: 'italic', color: '#555' }}>
                        {info}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    // Trip object has the following fields:
    // startLocation, endLocation, startDate, endDate, original owner email, original owner name, permission type, owner profile picture
    return (
        <>
            <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Trips Shared with Me</Typography>
            {trips.map((trip) => (
                <Grid container key={trip._id} alignitems="center" justify="center">
                    <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                        <Button style={{ textDecoration: 'none', padding: '5px', width: '100%' }} onClick={() => handleTripClick(trip._id)}>
                            <VerticalTripCard sx={{ minWidth: '250', backgroundColor: '#f5f5f5', }}>
                                <CardContentNoPadding>
                                    {getTripInfo("Trip Owner:", trip.owner.name)}
                                    {getTripInfo("Owner Email:", trip.owner.email)}
                                    <Divider />
                                    {getTripInfo("Origin:", trip.startLocation)}
                                    {getTripInfo("Destination:", trip.endLocation)}
                                    <Divider />
                                    {getTripInfo("From:", new Date(trip.startDate).toLocaleDateString())}
                                    {getTripInfo("To:", new Date(trip.endDate).toLocaleDateString())}
                                    <Divider />
                                    {getTripInfo("Access Type:", trip.permission == 1 ? "View Only" : "Edit")}
                                </CardContentNoPadding>
                            </VerticalTripCard>
                        </Button>
                    </Grid>
                </Grid>
            ))}
        </>
    );
};

export default SharedTrips;