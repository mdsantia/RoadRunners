import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Polyline, Marker, InfoWindow } from '@react-google-maps/api';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import { useLocation } from 'react-router-dom';

const infoWindowContainer = {
  background: 'white',
  padding: '10px',
  borderRadius: '4px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  maxWidth: '200px', // Adjust the width as needed
};

const infoWindowTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0',
};

const infoWindowRating = {
  fontSize: '14px',
  margin: '8px 0',
};

const infoWindowPrice = {
  fontSize: '14px',
  margin: '8px 0',
};

export default function Map(props) {
  const [userLocation, setUserLocation] = useState(null);
  const [polyline, setPolyline] = useState(null);
  const [center, setCenter] = useState(null);
  const [allStops, setAllStops] = useState(null);
  const [stops, setStops] = useState(null);
  const [zoom, setZoom] = useState(5);
  const { tripDetails } = useDashboardContext();
  const [gasStations, setGasStations] = useState([]);
  const [chosenRoute, setChosenRoute] = useState(0);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const iconSize = '10x10';
  var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  const location = useLocation();
  const prevLocation = useRef(location);

  function calculateCenter(polyline) {
    const midIdx = Math.floor(polyline.length / 2);
    const midPoint = polyline[midIdx];
    setCenter(midPoint);
  }

  const calculateZoom = (decoded) => {
    if (!props.size) {
      return;
    }
    const { width, height } = props.size;
    const WORLD_DIM = { height: height, width: width };
    const ZOOM_MAX = 10; // Maximum zoom level supported by Mapbox

    let maxLat = -Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let minLon = Infinity;

    for (const point of decoded) {
      maxLat = Math.max(maxLat, point.lat);
      minLat = Math.min(minLat, point.lat);
      maxLon = Math.max(maxLon, point.lng);
      minLon = Math.min(minLon, point.lng);
    }

    const latRad1 = (maxLat * Math.PI) / 180;
    const latRad2 = (minLat * Math.PI) / 180;
    const latDiff = latRad1 - latRad2;
    const lonDiff = (maxLon - minLon) * (Math.PI / 180);

    const zoomLat = Math.log(WORLD_DIM.height / (256 * latDiff)) / Math.LN2;
    const zoomLon = Math.log(WORLD_DIM.width / (256 * lonDiff)) / Math.LN2;

    // Choose the smaller of the two zoom levels
    const zoom = Math.min(zoomLat, zoomLon, ZOOM_MAX);
    setZoom(Math.ceil(zoom));
  };

  useEffect(() => {
    if (tripDetails && tripDetails.polyline) {
      setPolyline(tripDetails.polyline);
      setAllStops(tripDetails.allStops);
      setStops(tripDetails.stops);
      setChosenRoute(tripDetails.chosenRoute);
      calculateCenter(tripDetails.polyline);
      calculateZoom(tripDetails.polyline);
      if (tripDetails.chosenRoute == 0 && tripDetails.stops[1].gasStations && tripDetails.stops[1].gasStations.length > 0) {
        tripDetails.stops.forEach((stop) => {
          if (stop.gasStations && stop.gasStations.length > 0) {
            // If we didn't already add this gas station to the list, add it
            for(let i = 0; i < stop.gasStations.length; i++) {
              // If it already exists, don't add it
              if (gasStations.find(gas => gas.place_id === stop.gasStations[i].place_id)) {
                continue;
              }
              gasStations.push(stop.gasStations[i]);
            }
          }
        });
      }
      console.log(gasStations);
      if (tripDetails.chosenRoute == 0 && tripDetails.stops[1].restaurants && tripDetails.stops[1].restaurants.length > 0) {
        setRestaurants(tripDetails.stops[1].restaurants);
      }
      console.log(restaurants);
    }
  }, [tripDetails]);
    
  useEffect(() => {
    if (navigator.geolocation && !userLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  return (
    <>
      <GoogleMap
        center={center || userLocation || { lat: 40.43855441888486, lng: -86.91319150336594 }}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >

        {polyline && (
          <Polyline
            path={polyline}
            options={{
              strokeColor: 'blue',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {stops &&
          stops.map((marker, index) => (
            <Marker
              key={index}
              name={marker.name}
              position={marker.location}
              label={String(index + 1)} // Use index as the label
              onClick={() => {setSelectedMarker(marker)}}
            />
          ))
        }

    {gasStations &&
        gasStations.map((marker, index) => (
          <Marker
            key={index}
            name={marker.name}
            position={marker.location}
            icon={{
              url: iconBase + 'gas_stations.png' + '?size=' + iconSize,
              size: new window.google.maps.Size(40, 40),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(20, 20),
            }}
            onClick={() => {setSelectedMarker(marker)}}
            label={String(index + 1)} // Use index as the label
          />
        ))
      }

      {restaurants &&
          restaurants.map((marker, index) => (
            <Marker
              key={index}
              name={marker.name}
              icon={{
                path: /* global google */ google.maps.SymbolPath.CIRCLE,
                fillColor: 'grey',
                fillOpacity: 1,
                scale: 10,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
              position={marker.location}
              onClick={() => {setSelectedMarker(marker)}}
            />
          ))
        } 

        {/* {allStops &&
          allStops.map((marker, index) => (
            <Marker
              key={index}
              name={marker.name}
              position={marker.location}
              // onClick={setSelectedMarker(marker)}
              // icon={getStopIcon(marker)}
              icon={{
                // path: /* global google *\/ google.maps.SymbolPath.CIRCLE,
                fillColor: 'blue',
                fillOpacity: 1,
                scale: 10,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
              label={String(index + 1)} // Use index as the label
            />
          ))
        } */}
        
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.location}
            onCloseClick={() => {
              setSelectedMarker(null);
            }}
          >
            <div style={infoWindowContainer}>
              <h2 style={infoWindowTitle}>{selectedMarker.name}</h2>
              <p style={infoWindowRating}>
                Rating: {selectedMarker.rating || 'N/A'}
              </p>
              {selectedMarker.price && (
                <p style={infoWindowPrice}>Price: {selectedMarker.price}</p>
              )}
            </div>
          </InfoWindow>
        )}        

      </GoogleMap>
    </>
  );
}
