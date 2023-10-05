import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import { DirectionContextProvider } from '../context/DirectionContext';
import { useDirectionContext } from '../hooks/useDirectionContext';
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';

export default function Map(props) {
    const [userLocation, setUserLocation] = useState(null);
    const { direction, setDirection } = useDirectionContext();
    
    const directionsCallback = (response) => {
      if (response !== null) {
        if (response.status === 'OK') {
          // Render the directions on the map
          return <DirectionsRenderer directions={response} options={{
            polylineOptions: {
              strokeColor: 'blue'
            }}}/>;
        } else {
          console.error(`Directions request failed due to ${response.status}`);
        }
      }
    };

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

    return (
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={['places', 'map']}>
        <GoogleMap
          center={userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
          zoom={12}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          <DirectionsService
            options={{
              destination: 'Los Angeles, CA',
              origin: 'San Francisco, CA',
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />
        </GoogleMap>
      </LoadScript>
    );
}
