import React, { useRef, useEffect, useState } from 'react';
import { useDashboardContext } from '../../hooks/useDashboardContext';
import {faMapPin, faFlag, faGasPump, faUtensils, faMasksTheater, faBed} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

var map = null;
var markers = [];
var polyline = null;
const GMap = (props) => {
    const mapContainerRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [center, setCenter] = useState(null);
    const [allStops, setAllStops] = useState(null);
    const [stops, setStops] = useState(null);
    const [zoom, setZoom] = useState(5);
    const { tripDetails, liveEvents, hotels, setHotels } = useDashboardContext();
    const [gasStations, setGasStations] = useState([]);
    const [chosenRoute, setChosenRoute] = useState(0);
    const [restaurants, setRestaurants] = useState([]);
    const [events, setEvents] = useState([]); 
    const [selectedMarker, setSelectedMarker] = useState(null);
    const iconSize = '10x10';
    const [mapLoading, setMapLoading] = useState(true);
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    useEffect(() => {
        if (liveEvents) {
            setEvents(liveEvents);
            addEvents();
        }
    }, [liveEvents]);

    useEffect(() => {
        if (hotels.length > 0)  
            return;
        const fetchHotels = async () => {
          await axios
            .get('/api/roadtrip/getHotels', {
              params: {
                endLocation: tripDetails.stops[tripDetails.stops.length - 1].location,
                preferences: tripDetails.preferences.housingSelection,
              }
            })
            .then((response) => {
                setHotels(response.data);
                addHotels(response.data);
            })
            .catch((err) => {
              // setError(err.message);
            });
          }
        if (tripDetails && tripDetails.stops) {
          fetchHotels();
        }
      }, [tripDetails]);

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
        const ZOOM_MAX = 15; // Maximum zoom level supported by Mapbox

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

    const addHotels = (hotels) => {
        if (hotels) {
            hotels.forEach((stop, index) => {
                const markerIcon = {
                    path: faBed.icon[4],
                    fillColor: "#000000",
                    fillOpacity: 1,
                    anchor: new window.google.maps.Point(
                        faBed.icon[0] / 2, // width
                        faBed.icon[1], // height
                    ),
                    strokeWeight: 1,
                    strokeColor: "#ffffff",
                    scale: 0.04,
                };

                const marker = new window.google.maps.Marker({
                    position: stop.location,
                    map: map,
                    icon: markerIcon,
                    animation: window.google.maps.Animation.DROP,
                    title: `Hotel`,
                });

                markers.push(marker);

                // If marker is clicked, can't be clicked again for 2 seconds
                marker.addListener('click', () => {
                    if (marker.getAnimation() !== null) {
                        return;
                    }
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `Hotel: <span style="font-size:larger;"><strong>${stop.name}</strong></span>`, // Customize the content as needed
                    });
                    
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    infoWindow.open(map, marker);
                    
                    setTimeout(() => {
                        marker.setAnimation(null);
                        infoWindow.close();
                    }, 2000);
                });
            });
        }
    }

    const addEvents = () => {
        if (events) {
            events.forEach((event, index) => {
                const markerIcon = {
                    path: faMasksTheater.icon[4],
                    fillColor: "#04122a",
                    fillOpacity: 1,
                    anchor: new window.google.maps.Point(
                        faMasksTheater.icon[0] / 2, // width
                        faMasksTheater.icon[1], // height
                    ),
                    strokeWeight: 1,
                    strokeColor: "#ffffff",
                    scale: 0.04,
                };

                const marker = new window.google.maps.Marker({
                    position: event.location,
                    map: map,
                    icon: markerIcon,
                    animation: window.google.maps.Animation.DROP,
                    title: `Event`,
                });

                markers.push(marker);

                // If marker is clicked, can't be clicked again for 2 seconds
                marker.addListener('click', () => {
                    if (marker.getAnimation() !== null) {
                        return;
                    }
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `Event: <span style="font-size:larger;"><strong>${event.name}</strong></span>`, // Customize the content as needed
                    });
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    infoWindow.open(map, marker);

                    setTimeout(() => {
                        marker.setAnimation(null);
                        infoWindow.close();
                    }, 2000);
                });
            });
        }
    }

    const addGasStations = () => {
        if (gasStations) {
            gasStations.forEach((stop, index) => {
                const markerIcon = {
                    path: faGasPump.icon[4],
                    fillColor: "#333333",
                    fillOpacity: 1,
                    anchor: new window.google.maps.Point(
                        faGasPump.icon[0] / 2, // width
                        faGasPump.icon[1], // height
                    ),
                    strokeWeight: 1,
                    strokeColor: "#ffffff",
                    scale: 0.04,
                };
            
                const marker = new window.google.maps.Marker({
                    position: stop.location,
                    map: map,
                    icon: markerIcon,
                    animation: window.google.maps.Animation.DROP,
                    title: `Gas Station`,
                });

                markers.push(marker);
            
                // If marker is clicked, can't be clicked again for 2 seconds
                marker.addListener('click', () => {
                    if (marker.getAnimation() !== null) {
                        return;
                    }
                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<span style="font-size:larger;"><strong>${stop.name}</strong></span><br>Regular: <strong>$${stop.price.Regular}</strong><br>Premium: <strong>$${stop.price.Premium}</strong><br>Diesel: <strong>$${stop.price.Diesel}</strong>`, // Customize the content as needed
                    });

                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    infoWindow.open(map, marker);

                    setTimeout(() => {
                        marker.setAnimation(null);
                        infoWindow.close();
                    }, 2000);
                });
            });
        }
    }

    const addRestaurants = () => {
        if (restaurants) {
            restaurants.forEach((stop, index) => {
                const markerIcon = {
                    path: faUtensils.icon[4],
                    fillColor: "#88a5d8",
                    fillOpacity: 1,
                    anchor: new window.google.maps.Point(
                        faUtensils.icon[0] / 2, // width
                        faUtensils.icon[1], // height
                    ),
                    strokeWeight: 1,
                    strokeColor: "#ffffff",
                    scale: 0.04,
                };
            
                const marker = new window.google.maps.Marker({
                    position: stop.location,
                    map: map,
                    icon: markerIcon,
                    animation: window.google.maps.Animation.DROP,
                    title: `Food`,
                });
    
                markers.push(marker);
            
                // If marker is clicked, can't be clicked again for 2 seconds
                marker.addListener('click', () => {
                    if (marker.getAnimation() !== null) {
                        return;
                    }
                    const infoWindow = new window.google.maps.InfoWindow({
                    content: `<span style="font-size:larger;">Food: ${stop.name}</span>`, // Customize the content as needed
                    });
    
                    marker.setAnimation(window.google.maps.Animation.BOUNCE);
                    infoWindow.open(map, marker);
    
                    setTimeout(() => {
                        marker.setAnimation(null);
                        infoWindow.close();
                    }, 2000);
                });
            });
        }
    }

    /** Add all the stops, origin and destination with animations to the map */
    const addStops = () => {
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
            scale: 0.06,
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
            scale: 0.06,
        }

        if (stops) {
            stops.forEach((stop, index) => {
                setTimeout(() => {
                    const markerIcon = {
                        path: faMapPin.icon[4],
                        fillColor: "#00008B",
                        fillOpacity: 1,
                        anchor: new window.google.maps.Point(
                        faMapPin.icon[0] / 2, // width
                        faMapPin.icon[1] // height
                        ),
                        strokeWeight: 1,
                        strokeColor: "#ffffff",
                        scale: 0.06,
                    };
                
                    const marker = new window.google.maps.Marker({
                        position: stop.location,
                        map: map,
                        icon: index === 0 ? startIcon : index === stops.length - 1 ? endIcon : markerIcon,
                        animation: window.google.maps.Animation.DROP,
                        title: index === 0 ? `Origin` : index === stops.length - 1 ? `Destination` : `Stop ${index}`,
                    });
    
                    markers.push(marker);
                
                    // If marker is clicked, can't be clicked again for 2 seconds
                    marker.addListener('click', () => {
                        if (marker.getAnimation() !== null) {
                            return;
                        }
                        const infoWindow = new window.google.maps.InfoWindow({
                            content: index === 0 ? `<strong>${stop.name}</strong>` : index === stops.length - 1 ? `<strong>${stop.name}</strong>` : `<span style="font-size:larger;">Stop ${index}: <strong>${stop.name}</strong></span>`, // Customize the content as needed
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
        }
    }

    /** Add the polyline to the map */
    const insertPolyline = () => {
        const path = new window.google.maps.Polyline({
            path: tripDetails.polyline,
            geodesic: true,
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 4,
        });
        
        // Set the polyline on the map
        path.setMap(map);
        polyline = path;
    }

    /** GET UPDATED TRIP DETAILS */
    useEffect(() => {
        if (tripDetails && tripDetails.polyline) {
            setAllStops(tripDetails.allStops);
            setStops(tripDetails.stops);
            setChosenRoute(tripDetails.chosenRoute);
            calculateCenter(tripDetails.polyline);
            calculateZoom(tripDetails.polyline);
            let gasStations = [];
            if (tripDetails.options) {
                tripDetails.options[tripDetails.chosenRoute].forEach((stop) => {
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
            setGasStations(gasStations);
            let restaurants = tripDetails.options[tripDetails.chosenRoute][1].restaurants;
            setRestaurants(restaurants);
        }
    }, [tripDetails]);
        
    /** ATTEMPT TO GET USER'S LOCATION */
    useEffect(() => {
        if (markers && polyline) {
            markers.forEach(marker => marker.setMap(null));
            markers.length = 0; // Clear the markers array

            polyline.setMap(null);
            markers = [];
            polyline = null;
        }
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

    /** MAP RERENDERER */
    useEffect(() => {
        if (tripDetails && tripDetails.polyline) {
            setMapLoading(true);
            if (markers && polyline) {
                markers.forEach(marker => marker.setMap(null));
                markers.length = 0; // Clear the markers array
                polyline.setMap(null);
            }
            
            if (!map) {
                console.log('Initializing map...');
                map = new window.google.maps.Map(mapContainerRef.current, {
                    center: center,
                    zoom: zoom,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                });
                map.addListener('idle', () => {
                    setMapLoading(false); // Set loading to false when the map rendering is complete
                });
            } else {
                if (mapContainerRef.current && mapContainerRef.current.childElementCount === 0) {
                    mapContainerRef.current.appendChild(map.getDiv());
                }
                /** SUPPORT ANIMATIONS AND NOT RELOAD */
                setMapLoading(false);
            }
            insertPolyline();

            addGasStations();

            addStops();

            addRestaurants();
            
            return () => {
                if (map) {
                    window.google.maps.event.clearInstanceListeners(map);
                }
            };
        }

      }, [center]);
    

    return (
        <div style={{ height: '100%', position: 'relative' }}>
        {mapLoading && (
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                }}
            >
               <CircularProgress size={100} thickness={3} color="secondary"  />
            </div>
        )}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
    );
};

export default GMap;
