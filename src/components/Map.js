import React from 'react';
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';
import { TextField } from '@mui/material';

export default function Map() {
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    })

    if (!isLoaded) {
        return <TextField></TextField>
    }
    return (
        <GoogleMap 
        center={{lat: 48.8584, lng: 2.2945}} 
        zoom={10} 
        mapContainerStyle={{width: '100%', height: '100%'}}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
        }}
        >
            
        </GoogleMap>
    );
}