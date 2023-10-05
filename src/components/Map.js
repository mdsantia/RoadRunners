import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';

export default function Map(props) {
    const [userLocation, setUserLocation] = useState(null);
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        // Move the nonce and libraries options to a separate object
        // and pass them as dependencies to ensure they don't change
        // between renders.
        dependencies: {
          libraries: ['places'],
          nonce: props.nonce,
        }
    })

    useEffect(() => {
        if (navigator.geolocation && !userLocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
          }, (error) => {
            console.error('Error getting user location:', error);
          });
        }
    }, []);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
          center={userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
          zoom={5}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {props.directionsResponse ? (
            <>
              <DirectionsRenderer directions={props.directionsResponse} />
            </>
          ) : (
            0
          )}
        </GoogleMap>
    );
}
