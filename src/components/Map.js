import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript, Polyline } from '@react-google-maps/api';
import { DirectionContextProvider } from '../context/DirectionContext';
import { useDirectionContext } from '../hooks/useDirectionContext';
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';

export default function Map() {
  const [userLocation, setUserLocation] = useState(null);
  const { directions, directionSet, center, setCenter, directionsCallback } = useDirectionContext();
  const [decodedPath, setDecodedPath] = useState(null);
  
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
    if (directions) {
      // Calculate the new center based on the directions
      var decoded = /* global google */ google.maps.geometry.encoding.decodePath(directions.routes[0].overview_polyline.points);
      setDecodedPath(decoded);
      console.log(directions);
      let sumLat = 0;
      let sumLng = 0;
      for (const point of decoded) {
        sumLat += point.lat();
        sumLng += point.lng();
      }
      
      // Calculate the average latitude and longitude
      const avgLat = sumLat / decoded.length;
      const avgLng = sumLng / decoded.length;
      const newCenter = {
        lat: avgLat,
        lng: avgLng
      };
      setCenter(newCenter);
    }
  }, [directions]);

  return (
      <GoogleMap
        center={ center || userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
        zoom={9}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >

      {directions && (
        <Polyline 
          path={decodedPath}
          options={{
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      )}
      </GoogleMap>
  );
}
