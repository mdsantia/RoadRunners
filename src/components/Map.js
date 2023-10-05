import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import { DirectionContextProvider } from '../context/DirectionContext';
import { useDirectionContext } from '../hooks/useDirectionContext';
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';
const GOOGLE_MAPS_LIBRARIES = ['places'];


export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const { direction, setDirection } = useDirectionContext();

  
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

  const [directionSet, setDirectionSet] = useState(false);

  const directionsCallback = (response) => {
    if (directionSet) {
      return;
    }
    if (response !== null) {
      if (response.status === 'OK') {
        // Store the directions data in state
        setDirections(response);
        // Set color of polyline to red
        setDirectionSet(true);
      } else {
        console.error(`Directions request failed due to ${response.status}`);
      }
    }
  };

  return (
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
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: 'red'
              }
            }}
          />
        )}

        <DirectionsService
          options={{
            destination: 'Los Angeles, CA',
            origin: 'San Francisco, CA',
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
      </GoogleMap>
  );
}
