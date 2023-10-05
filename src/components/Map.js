import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript } from '@react-google-maps/api';
import { DirectionContextProvider } from '../context/DirectionContext';
import { useDirectionContext } from '../hooks/useDirectionContext';
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const { directions, directionSet, center, directionsCallback } = useDirectionContext();
  
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

  useEffect(() => {
    if (directions && !directionSet) {
      // Calculate the new center based on the directions
      const newCenter = {
        lat: directions.routes[0].overview_path[directions.routes[0].overview_path.length / 2].lat(),
        lng: directions.routes[0].overview_path[directions.routes[0].overview_path.length / 2].lng(),
      };
    }
  }, [directions]);

  return (
      <GoogleMap
        center={ center || userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
        zoom={5}
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
            destination: 'Los Angeles, CA, USA',
            origin: 'San Francisco, CA, USA',
            travelMode: 'DRIVING',
            provideRouteAlternatives: true,
            drivingOptions: {
              departureTime: new Date('October 6, 2023'), // + time
              trafficModel: 'pessimistic'
            },
          }}
          callback={directionsCallback}
        />
      </GoogleMap>
  );
}
