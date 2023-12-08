import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Box from '@mui/material/Box';
import HotelCard from '../StopsComponents/Hotels';
import { useEffect } from 'react';
import {useDashboardContext} from '../../context/DashboardContext'
import { Container, Typography, CardMedia, CardContent, Grid, CardActions, Checkbox, Divider } from '@mui/material';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import LandMarkImage from '../../assets/FHV-image.jpeg';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StarRateIcon from '@mui/icons-material/StarRate';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from '../additionalFeatures/StrictModeDroppable';
import LinearProgress from '@mui/material/LinearProgress';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function AttractionsList({viewOnly, minimumMPG}) {
    const [value, setValue] = React.useState(0);
    const [stops, updateStops] = useState([]);
    const { tripDetails, changeStops } = useDashboardContext();
    const [expandedCard, setExpandedCard] = useState(null);
    const [tripFuelCost, setTripFuelCost] = useState(0);
    const [allGasStations, setAllGasStations] = useState([]);

    const handleExpandCard = (index) => {
        setExpandedCard(index === expandedCard ? null : index);
    };

    useEffect(() => {
        if (tripDetails && tripDetails.allStops) {
            
            // setAllAttractions(tripDetails.allStops);
            // tripDetails.stops.forEach((stop) => {
            //     if (stop.category !== 'start' && stop.category !== 'end' && !selectedStops.some(item => item.id === stop.id)) {
            //     selectedStops.push(stop);
            //     }
            // });
            tripDetails.stops.forEach((stop) => {
                if (stop.gasStations && stop.gasStations.length > 0) {
                  // If we didn't already add this gas station to the list, add it
                  for(let i = 0; i < stop.gasStations.length; i++) {
                    // If it already exists, don't add it
                    if (allGasStations.find(gas => gas.place_id === stop.gasStations[i].place_id)) {
                      continue;
                    }
                    allGasStations.push(stop.gasStations[i]);
                    getTripFuelCost();
                  }
                }
              });
            updateStops(tripDetails.stops);
        }
    }, [tripDetails, tripDetails && tripDetails.stops]);

     /* stop selection functions */
    const handleStopSelection = (stop, selectedList, setSelectedList) => {
      delete stop.routeFromHere;
      const index = tripDetails.stops.findIndex((selectedStop) => selectedStop.place_id === stop.place_id);
      const newStops = tripDetails.stops.map(stop => {
      const stopCopy = { ...stop };
      return stopCopy;
      }); 
      
      // Remove Stop from route
      axios
      .post('/api/roadtrip/removeStop', {indexToRemove: index, stops: newStops} )
      .then((res) => {
        changeStops(res.data, -1);
        setSelectedList((prevSelectedList) =>
        prevSelectedList.filter((s) => s.place_id !== stop.place_id)
      );
      })  
      .catch((err) => {
        console.log(err);
      });
    };

    function getTripFuelCost() {
        if (tripDetails && tripDetails.options[tripDetails.chosenRoute]) {
            
            let totalDistance = 0;
            for (let j = 0; j < tripDetails.options[tripDetails.chosenRoute].length - 1; j++) {
                totalDistance += tripDetails.options[tripDetails.chosenRoute][j].distance ;
            }
            console.log(totalDistance);
              
            let averageFuelCost = getAverageFuelCost(); 
            let fuelEconomy = 20;

            let totalFuelCost = totalDistance * ( averageFuelCost * (1/fuelEconomy));
            totalFuelCost = parseFloat(totalFuelCost.toFixed(2));
            console.log("Total fuel cost", totalFuelCost)
            setTripFuelCost(totalFuelCost);
        }
    }

    function getAverageFuelCost() {
        if (allGasStations.length === 0) {
            return 0; 
        }
        let totalCost = 0;
        allGasStations.forEach((gasStation) => {
            const { Regular, Premium } = gasStation.price;

            if (Regular && Premium) {
                totalCost += Regular + Premium;
            }
        });

        // Calculate the average cost
        const averageCost = totalCost / (allGasStations.length * 2); // Multiplying by 2 as there are two types of fuel prices (Regular and Premium)
        return averageCost;
    }



    const getRouteDetails = (infoLabel, info) => {
        return (
            <Grid container alignItems="left" textAlign="left" spacing={0}>
                <Grid item xs={5} sm={5} md={5}>
                    <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                        {infoLabel}
                    </Typography>
                </Grid>
                <Grid item xs={7} sm={7} md={7}>
                    <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                        {info}
                    </Typography>
                </Grid>
            </Grid>
        );
    }


   

    async function handleOnDragEnd (result) {
        const from = result.source.index;
        const to = result.destination.index;
        if (!result.destination || from === to || viewOnly) return;
        const old = [...stops];
        console.log(old);

        let newStops = Array.from([...stops]);

        newStops[from - 1].routeFromHere = null;
        newStops[from].routeFromHere = null;
        newStops[to - 1].routeFromHere = null;

        const [removed] = newStops.splice(from, 1);
        newStops.splice(to, 0, removed);
        
        await axios.post('/api/roadtrip/rearrangeStops', {
            stops: newStops
        }).then(response => {
            newStops = response.data;
            changeStops(newStops);
            updateStops(newStops);
        }).catch(error => {
            console.log(error.response.data.error);
            alert("There was an error saving your vehicle ranking: " + error.response.data.error + ".\nPlease try again.");
        });
      }

    if (tripDetails && !tripDetails.stops) {
        return (
            <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold'}}>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            <LinearProgress color="inherit" />
            <br></br>
            </Typography>
        );
    }

    if (tripDetails && tripDetails.stops) {
        return (
            <Box
            sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', height: '100%', alignContent: 'center', alignItems: 'start', padding: '0', width: '100%' }}
            >
            <Container value={value} index={0} style={{ maxHeight: '400px', overflowY: 'auto', textAlign: 'left', alignItems: 'left'}}>
                {getRouteDetails("Starting Location:", tripDetails.stops[0].name)}
                <br></br>
                {getRouteDetails("Destination:", tripDetails.stops[tripDetails.stops.length - 1].name)}
                <br></br>
                {getRouteDetails("Total Number of Stops:", tripDetails.stops.length - 2)}
                <br></br>
                {getRouteDetails("Fuel Cost of Trip ($) :", tripFuelCost)}
                <br></br>
                {getRouteDetails("Number of Vehicles:", tripDetails.numVehicles)}
                <br></br>
                <Divider></Divider>
                <br></br>
                <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                    Your Selected Vehicle(s) for This Trip:
                </Typography>
                {tripDetails.selectedVehicles.map((vehicle, index) => (
                    <li variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontStyle: 'italic', color: '#555'}}>
                        {vehicle}
                    </li>
                ))}
                <br></br>
                <Divider></Divider>
                <br></br>
                <Typography variant="body1" style={{ fontSize: '1rem', textTransform: 'none', fontWeight: 'bold' }}>
                    Stops Along Your Route:
                </Typography>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <StrictModeDroppable droppableId="stops" direction="vertical">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {stops.map((stop, index) => {
                                    if (stop.category !== "start" && stop.category !== "end") {
                                        return (
                                            <Draggable key={index} draggableId={`stop-${index}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <Item
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            margin: '0 auto',
                                                            marginTop: '3%',
                                                            marginBottom: '3%',
                                                            cursor: 'pointer',
                                                            transition: 'height 0.3s',
                                                            height: '60px',
                                                            width: '100%',
                                                            backgroundColor: '#f5f5f5',
                                                            boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                                                            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
                                                            ...provided.draggableProps.style,
                                                        }}
                                                        // onClick={() => handleExpandCard(index)}
                                                    >
                                                        <CardContent sx={{ flex: '1' }}>
                                                            <Grid container spacing={0.5} justifyContent="center" alignItems="center">
                                                                <Grid item md={12} sx={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                                    <a
                                                                        href={stop.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        style={{ textDecoration: 'none', color: 'black' }}
                                                                        // onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                                        // onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                                    >
                                                                        {stop.name}
                                                                    </a>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                        <CardActions 
                                                            sx={{ justifyContent: 'center', flex: '0 0 5%' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Stop the click event from propagating to the parent element
                                                            }}
                                                        >
                                                            <Checkbox
                                                                icon={<AddLocationAltOutlinedIcon />}
                                                                checkedIcon={<AddLocationAltIcon />}
                                                                checked={true}
                                                                disabled={viewOnly}
                                                                onChange={() => handleStopSelection(stop, stops, updateStops)}
                                                            />
                                                        </CardActions>
                                                    </Item>
                                                )}
                                            </Draggable>
                                        );
                                    }
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
            </Container>
            </Box>
        );
    }    

}