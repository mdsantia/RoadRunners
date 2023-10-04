import { React, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from "@react-google-maps/api";
import { GOOGLE_MAPS_API_KEY } from './AddressSearch';

export default function Map({directionsResponse}) {
    // const [map, setMap] = useState(/** @type google.maps.Map */ (null));
    const [userLocation, setUserLocation] = useState(null);
    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    })

    useEffect(() => {
        // Get the user's current location using the Geolocation API
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
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {directionsResponse ? (
            <>
              <DirectionsRenderer directions={directionsResponse} />
              {console.log("Directions Response:", directionsResponse)}
            </>
          ) : (
            console.log("NO")
          )}
        </GoogleMap>
      );
      
}