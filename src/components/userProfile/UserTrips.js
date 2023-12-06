import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { Grid, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import { Container, Avatar } from '@mui/material';
import { MenuItem, Select, Autocomplete, Snackbar } from '@mui/material';


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
    const [userTrips, setUserTrips] = useState([]);
    //users_shared array of objects 
    useEffect(() => {
        if (!user) {
            return;
        } 
        if (userTrips.length > 0) {
            return;
        }
        async function fetchUserTrips() {
            await axios.get(`/api/trip/getTrips/${user.email}`)
            .then((response) => {
                console.log(response.data);
                setUserTrips(response.data);
            }).catch((error) => {
                console.log(error);
            });
        }
        fetchUserTrips();
    }, [user]);

    const handleTripClick = async (tripid) => {
        navigate(`/dashboard/${tripid}`);
    }

    const handleDeleteTrip = async (tripid, event) => {
        event.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to delete this trip?");
        if (!confirmed) {
            // User clicked "Cancel," do nothing
            event.stopPropagation();
            return;
        }
        await axios.post(`/api/trip/deleteTrip/${user.email}/${tripid}`)
        .then((response) => {
            const newUser = response.data;
            updateUser(newUser);
            for(let i = 0; i < userTrips.length; i++) {
                if (userTrips[i]._id == tripid) {
                    userTrips.splice(i, 1);
                    setUserTrips(userTrips);
                    break;
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const handleClearTrips = async () => {
        const confirmed = window.confirm("Are you sure you want to clear your trip history?");
        if (!confirmed) {
            return;
        }
        await axios.post(`/api/trip/clearTrips/${user.email}`)
        .then((response) => {
            const newUser = response.data;
            updateUser(newUser);
        }).catch((error) => {
            console.log(error);
        }) 
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
                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                        {info}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    if (!userTrips) {
        return (
            <>
                <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Saved Trips</Typography>
                <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Loading</Typography>
            </>
        );
    }

    return (
        <>
            <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Saved Trips</Typography>
            <Button style={{ textDecoration: 'none' }} onClick={handleClearTrips}> 
                <Typography style={{ fontSize: '12px', fontWeight: 'bold', color: '#555', cursor:'pointer' }}>Clear All</Typography>
            </Button>
            {/* <Grid container spacing={2}> */}
                {userTrips.map((trip) => {
                     // Decode the trip.hash
                    return (
                        <Grid container key={trip._id} alignitems="center" justify="center">
                            <Grid item xs={11} sm={11} md={11} lg={11} xl={11}>
                                <Button style={{ textDecoration: 'none', padding: '5px', width: '100%' }} onClick={() => handleTripClick(trip._id)}>
                                    <VerticalTripCard
                                        sx={{
                                            minWidth: '250',
                                            backgroundColor: '#f5f5f5',
                                        }}
                                    >
                                        <CardContentNoPadding>
                                            {getTripInfo("Origin:", trip.startLocation)}
                                            {getTripInfo("Destination:", trip.endLocation)}
                                            <Divider />
                                            {getTripInfo("From:", new Date(trip.startDate).toLocaleDateString())}
                                            {getTripInfo("To:", new Date(trip.endDate).toLocaleDateString())}
                                            <Divider />
                                            <Grid container alignitems="left" textAlign="left" spacing={0}>
                                                <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                                                    <Typography variant="body1" style={{ fontSize: '14px', textTransform: 'none', fontWeight: 'bold' }}>
                                                       Shared: 
                                                    </Typography>
                                                </Grid>
                                                
                                            </Grid>
                                            {trip.users_shared.map((user, index) => {
                                                { console.log(user) }
                                                return (
                                                    <Grid container style={{ marginBottom: '2%' }} key={index}>
                                                        <Grid item xs={9} sm={9} md={9}>

                                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                                                                <Avatar src={user.profile_picture} alt="Profile" />
                                                                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                                    <Typography sx={{ fontSize: '15px' }}>{user.name}{user.email === user.email ? ` (you)` : null}</Typography>
                                                                    <Typography sx={{ fontSize: '12px', color: 'grey' }}>{user.email}</Typography>
                                                                </div>
                                                            </div>


                                                        </Grid>

                                                    </Grid>

                                                )
                                            })}
                
                                        </CardContentNoPadding>
                                    </VerticalTripCard>
                                </Button>
                            </Grid>
                            <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                <Button onClick={(event) => handleDeleteTrip(trip._id, event)}>
                                    <VerticalTripCard sx={{ minWidth: '250', backgroundColor: '#f5f5f5' }}>
                                        <CardContentNoPadding alignitems="center">
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
