import React from 'react';
import axios from 'axios';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/additionalFeatures/TopBar';
import CreateTrip from '../components/newTrip/CreateTrip'
import {useDashboardContext} from '../hooks/useDashboardContext';
import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GMap from '../components/newTrip/GMap';
import Itinerary from '../components/newTrip/Itinerary';
import { useNavigate } from 'react-router-dom';
const { useUserContext } = require('../hooks/useUserContext');

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    height: '90vh',
    flexDirection: 'column',
    position: 'relative', // Set position to relative
    [theme.breakpoints.down('sm')]: {
        flexDirection:'row',
        display:'row',
    }
}));
const CreateTripContainer = styled('div')(({ theme }) => ({
    position: 'relative',
    zIndex: 2, // Set a higher z-index for CreateTrip to make it appear above Map
    backgroundColor: 'rgba(255, 255, 255, 0)', // Make CreateTripContainer semi-transparent
    [theme.breakpoints.down('sm')]: {
        display: 'row',
        width:'100%',
        left:'0%',
        top:'0%',
        borderRadius: 0
    }
}));
const MapWrapper = styled(Card)(({ theme }) => ({
    width: '50%', // Set the width to 100%
    height: '95%', // Set the height to 100%
    position: 'absolute', // Set position to absolute
    top: '4%',
    left: '1%',
    borderRadius: 20,
    display: 'inline-block', // Set display to inline-block
    [theme.breakpoints.down('sm')]: {
        display: 'row',
        width:'100%',
        left:'0%',
        top:'0%',
        borderRadius: 0
    }
}));

const Wrapper = styled(Card)(({ theme }) => ({
    width: '47%', // Set the width to 100%
    height: '95%', // Set the height to 100%
    position: 'absolute', // Set position to absolute,
    borderRadius: 20,
    right:'1%',
    top:'4%',
    [theme.breakpoints.down('sm')]: {
        display: 'row',
        top:'95%',
        width:'100%',
        borderRadius:0,
    }
}));


export default function Dashboard() {
    const {tripid, tempid} = useParams();
    const { user } = useUserContext();
    const navigate = useNavigate();
    const mapWrapperRef = useRef(null);
    const { tripDetails, setTripDetails, directionsCallback } = useDashboardContext();
    const location = useLocation();
    const prevLocation = useRef(location);
    const [viewOnly, setViewOnly] = useState(false);
    const [sharedTrip, setSharedTrip] = useState(false);
    const [locked, setLocked] = useState(false);
    
    if (prevLocation.current.pathname !== location.pathname) {
        window.location.reload();
    }

    useEffect(() => {
      // Check if the pathname has changed
    }, [location]);

    useEffect(() => {
        if (!user) {
            return;
        }
        if (tripDetails) {
            return;
        }
        const fetchTrip = async () => {
            let access = false;
            await axios.get(`/api/trip/getTrip/${tripid}`) 
            .then((res) => {
                if (res.data.user_email !== user.email) {
                    res.data.users_shared.forEach((shared) => {
                        if (shared.email == user.email) {
                            access = true;
                            setSharedTrip(true);
                            if (shared.permission == 1) {
                                setViewOnly(true);
                            } else if (shared.permission == 2) {
                                setViewOnly(false);
                            }
                        }
                    });
                } else {
                    access = true;
                }
                // if (access) {
                //     if (!res.data.locked) {
                //         axios.post(`/api/trip/lockUnlock/${tripid}/1`);
                //     } else {
                //         setViewOnly(true);
                //         setLocked(true);
                //     }
                // }
                if (!access) {
                    setTripDetails(null);
                    navigate('/');
                }
                setTripDetails(res.data);
            })
            .catch((err) => {
                console.log(err);
                setTripDetails(null);
                navigate('/');
            });
        } 
        if (tripid) {
            fetchTrip();
        } else if (tempid) {
            // Fetch trip from local storage
            const tempTrips = JSON.parse(localStorage.getItem('tempTrips')) || {};
            const trip = (tempTrips ? tempTrips[tempid] : null) || null;
            if (!trip) {
                setTripDetails(null);
                navigate('/');
            }
            if (trip.user_email != user.email) {
                setTripDetails(null);
                navigate('/');
            }
            setTripDetails(trip);
        }
    }, [tripid, tempid, user]);

    useEffect(() => {
        if (tripDetails && tripDetails.allStops) {
            return;
        }
        if (tripDetails && tripDetails.startLocation && tripDetails.endLocation && tripDetails.startDate && tripDetails.endDate) {
            buildRoadTrip();
        }
    } , [tripDetails]);

    const buildRoadTrip = () => {
        if (tripDetails && tripDetails.allStops) {
            return;
        }
        
        const roadtripParams = {
            startLocation: tripDetails.startLocation,
            endLocation: tripDetails.endLocation,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate,
            preferences: tripDetails.preferences,
            mpg: tripDetails.minimumMPG,
        };

        axios
        .get('/api/roadtrip/newRoadTrip', { params: roadtripParams })
        .then((res) => {
            directionsCallback(res.data, tempid);
        })  
        .catch((err) => {
            console.log(err);
        }); 
    };  

      return (
        <div style={{ backgroundColor: '#F3F3F5'}}>
            <TopBar/>
            <Container sx={{ marginTop: '75px' }}>
                <CreateTripContainer>
                    <CreateTrip disableNewTrip={true}/>
                </CreateTripContainer>
                
                <MapWrapper ref={mapWrapperRef}>
                    <GMap size={mapWrapperRef.current?mapWrapperRef.current.getBoundingClientRect():null}/>
                </MapWrapper>
                <Wrapper>
                    <Itinerary viewOnly={viewOnly} sharedTrip={sharedTrip} />
                </Wrapper>
            </Container>
        </div>
    );
}
