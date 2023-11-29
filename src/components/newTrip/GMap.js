import React, { useRef, useEffect, useState } from 'react';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import {faMapPin, faFlag} from '@fortawesome/free-solid-svg-icons';

const GMap = (props) => {
    let map;
    const mapContainerRef = useRef(null);
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

    useEffect(() => {
        console.log('Initializing map...');
        map = new window.google.maps.Map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        });
      
        // Add a marker
        // new window.google.maps.Marker({
        //   position: { lat: -34.397, lng: 150.644 },
        //   map: map,
        //   title: 'Hello World!',
        // });

    if (tripDetails && tripDetails.polyline) {
        const path = new window.google.maps.Polyline({
            path: tripDetails.polyline,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
        });
        
        // Set the polyline on the map
        path.setMap(map);

        const startIcon = {
            path: faFlag.icon[4],
            fillColor: "#05ff2f",
            fillOpacity: 1,
            anchor: new window.google.maps.Point(
                faFlag.icon[0] / 2, // width
                faFlag.icon[1], // height
            ),
            strokeWeight: 1,
            strokeColor: "#ffffff",
            scale: 0.04,
        }

        const endIcon = {
            path: faFlag.icon[4],
            fillColor: "#d70404",
            fillOpacity: 1,
            anchor: new window.google.maps.Point(
                faFlag.icon[0] / 2, // width
                faFlag.icon[1], // height
            ),
            strokeWeight: 1,
            strokeColor: "#ffffff",
            scale: 0.04,
        }

        stops.forEach((stop, index) => {
            setTimeout(() => {
              const markerIcon = {
                path: faMapPin.icon[4],
                fillColor: "#2f6eda",
                fillOpacity: 1,
                anchor: new window.google.maps.Point(
                  faMapPin.icon[0] / 2, // width
                  faMapPin.icon[1] // height
                ),
                strokeWeight: 1,
                strokeColor: "#ffffff",
                scale: 0.04,
              };
          
              const marker = new window.google.maps.Marker({
                position: stop.location,
                map: map,
                icon: index === 0 ? startIcon : index === stops.length - 1 ? endIcon : markerIcon,
                animation: window.google.maps.Animation.DROP,
                title: `Stop ${index + 1}`,
              });
          
              // If marker is clicked, can't be clicked again for 2 seconds
              marker.addListener('click', () => {
                if (marker.getAnimation() !== null) {
                    return;
                }
                const infoWindow = new window.google.maps.InfoWindow({
                  content: `Stop ${index + 1}: ${stop.name}`, // Customize the content as needed
                });

                marker.setAnimation(window.google.maps.Animation.BOUNCE);
                infoWindow.open(map, marker);

                setTimeout(() => {
                    marker.setAnimation(null);
                    infoWindow.close();
                }, 2000);
              });
            }, index * 400); // Multiply index by 200ms to stagger the markers
          });
              
            return () => {
                if (map) {
                  window.google.maps.event.clearInstanceListeners(map);
                }
            };
        }
      }, [center]);

    return (
        <div style={{ height: '100%' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
};

export default GMap;
