import React from 'react';
import axios from 'axios';
import { Card, Button, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import TopBar from '../components/additionalFeatures/TopBar';
import CreateTrip from '../components/newTrip/CreateTrip'
import {useDashboardContext} from '../hooks/useDashboardContext';
import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Map from '../components/newTrip/Map';
import Itinerary from '../components/newTrip/Itinerary';
import { useNavigate } from 'react-router-dom';

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
    const {tripString} = useParams();
    const [nonce, setNonce] = useState('');
    const navigate = useNavigate();
    const mapWrapperRef = useRef(null);
    const { tripDetails, setTripDetails, directionsCallback } = useDashboardContext();

    useEffect(() => {
        // Fake nonce generation for purposes of demonstration
        const uuid = uuidv4();
        // console.log('uuid:', uuid);
        setNonce(`nonce-${uuid}`);
        let decodedTripDetails;
        try {
            decodedTripDetails = JSON.parse(atob(tripString)).tripDetails;
            setTripDetails(decodedTripDetails);
        } catch (err) {
            console.log(err);
            setTripDetails(null);
            //navigate('/');
            return;
        }
    }, [tripString]);

    useEffect(() => {
        if (tripDetails && !tripDetails.allStops) {
            buildRoadTrip();
        }
    }, [tripDetails]);

    const buildRoadTrip = () => {
        if (tripDetails.allStops) {
            console.log('Trip already built');
            return;
        }
        const roadtripParams = {
            startLocation: tripDetails.startLocation,
            endLocation: tripDetails.endLocation,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate
        };

        axios
        .get('/api/roadtrip/newRoadTrip', { params: roadtripParams })
        .then((res) => {
            directionsCallback(res.data);
            //navigate(`/dashboard/${encodedTripDetails}`);
        })  
        .catch((err) => {
            console.log(err);
        });
    };

      return (
        <div style={{ backgroundColor: '#F3F3F5'}}>
            <TopBar></TopBar>
            <Container sx={{ marginTop: '75px' }}>
                <CreateTripContainer>
                    {/* Add your CreateTrip component here */}
                    <CreateTrip/>
                </CreateTripContainer>
                
                <MapWrapper ref={mapWrapperRef}>
                    {/* Add your Map component here */}
                    <Map size={mapWrapperRef.current?mapWrapperRef.current.getBoundingClientRect():null}/>
                </MapWrapper>
                <Wrapper>
                    <Itinerary />
                </Wrapper>
            </Container>
        </div>
    );
}
