import { React, useState } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';
import { TextField } from '@mui/material';

export default function Map({directionsResponse}) {
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    // const {isLoaded} = useJsApiLoader({
    //     googleMapsApiKey: GOOGLE_MAPS_API_KEY
    // })

    // if (!isLoaded) {
    //     return <TextField></TextField>
    // }
    return (
        <GoogleMap 
        center={{lat: 40.43855441888486, lng: -86.91319150336594}} 
        zoom={15} 
        mapContainerStyle={{width: '100%', height: '100%'}}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
        }}
        onLoad = {map => setMap(map)}
        >
            {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )?0:console.log("NO")}
        </GoogleMap>
    );
}