import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Container } from '@mui/material';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from './StrictModeDroppable';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useUserContext } from '../../hooks/useUserContext';
import './CarRanking.css'

function CarRanking({onSelectCar}) {
  const [vehicles, updateVehicles] = useState([]);
  const {user, updateUser} = useUserContext();
  const [clickedItemId, setClickedItemId] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSelectCar = (vehicleId) => {
    const foundVehicle = vehicles.find((vehicle) => vehicle._id === vehicleId);
    onSelectCar(foundVehicle);
    setClickedItemId(vehicleId);
  }

  const handleRemoveCar = async (vehicleId, event) => {
    const confirmed = window.confirm("Are you sure you want to remove this car?");
    
    if (!confirmed) {
      // User clicked "Cancel," do nothing
      event.stopPropagation();
      return;
    }
    // add alert

    await axios.post('/api/user/removeVehicle', {
      email: user.email,
      _id: vehicleId
    }).then(response => {
      const newUser = response.data;
      updateUser(newUser);
      updateVehicles(newUser.vehicles);
    }).catch(error => {
      console.log(error.response.data.error);
      alert("There was an error removing your vehicle: " + error.response.data.error + ".\nPlease try again.");
    });
    onSelectCar(null);
  }

  React.useEffect(() => {
    if (!user) {
      return;
    } 
    console.log(user)
    const dragVehicles = user.vehicles.map((vehicle, index) => {
      // Create a new object with additional fields
      return {
        id: vehicle._id,
        _id: vehicle._id,
        mpg: vehicle.mpg,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        ranking: vehicle.ranking,
        name: `${vehicle.color} ${vehicle.year} ${vehicle.make}`,
        thumb: '/images/carIcon.png'
      };
    });
    updateVehicles(dragVehicles);
}, [user]);

  async function handleOnDragEnd (result) {
    if (!result.destination) return;
    
    const items = Array.from(vehicles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newVehicles = items.map((vehicle, index) => {
      return {
        _id: vehicle._id,
        mpg: vehicle.mpg,
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        color: vehicle.color,
        ranking: index
    }});

    await axios.post('/api/user/vehicleRanking', {
      email: user.email,
      vehicles: newVehicles
    }).then(response => {
      const newUser = response.data;
      updateUser(newUser);
      const newVehiclesDrag = newVehicles.map((vehicleDrag, index) => {
        return {
          ...vehicleDrag,
          id: vehicleDrag._id,
          name: `${vehicleDrag.color} ${vehicleDrag.year} ${vehicleDrag.make}`,
          thumb: vehicleDrag.thumb
      }});
      updateVehicles(newVehiclesDrag);
  }).catch(error => {
      console.log(error.response.data.error);
      alert("There was an error saving your vehicle ranking: " + error.response.data.error + ".\nPlease try again.");
  });
  }

  return (
    <div className="Drag-Exam">
      <header className="Drag-Exam-header">
        <Typography style={{ fontSize: '25px', fontWeight: 'bold', color: 'darkblue' }}>Your Vehicles</Typography>
        <br></br>
        <Container>
          <Typography>Drag and drop to rank your vehicles.<br></br>Click on a vehicle to load its information and edit it.</Typography>
        </Container>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <StrictModeDroppable droppableId="characters">
            {(provided) => (
              <ul className="characters" style={{ textAlign: 'right'}} {...provided.droppableProps} ref={provided.innerRef}>
                {vehicles.map(({id, ranking, name, thumb}, index) => {
                  const isClicked = clickedItemId === id;
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef} 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps}
                          onClick={() => handleSelectCar(id)}
                          onMouseEnter={() => setHoveredItem(id)}
                          onMouseLeave={() => setHoveredItem(null)}
                          style={{
                            boxShadow: (snapshot.isDragging || isClicked || id === hoveredItem) ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <ArrowBackIosNewIcon style={{ fontSize: '36px', textAlign: 'right', cursor:'pointer'}}/>
                          <div className="characters-thumb">
                            <img src={thumb} alt={`${name} Thumb`} />
                          </div>
                          <p style={{ fontFamily: 'Arial', fontSize: '16px', textAlign: 'right'}}>
                            {ranking}: { name }
                            <br />
                            <DeleteForeverIcon style={{ fontSize: '30px', textAlign: 'right', cursor:'pointer'}} onClick={(event) => handleRemoveCar(id, event)}/>
                          </p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </StrictModeDroppable>
        </DragDropContext>
      </header>
    </div>
  );
}

export default CarRanking;
