import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Container } from '@mui/material';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from '../additionalFeatures/StrictModeDroppable';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useUserContext } from '../../hooks/useUserContext';
import './CarRanking.css'

const rankNames = ["Primary", "Secondary", ""];

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
        fuelGrade: vehicle.fuelGrade,
        name: `${vehicle.color} ${vehicle.year} ${vehicle.make}`,
        thumb: '/images/carIcon.png'
      };
    });
    updateVehicles(dragVehicles);
}, [user]);

  async function handleOnDragEnd (result) {
    if (!result.destination) return;
    
    const oldVehicles = vehicles;
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
        ranking: index,
        fuelGrade: vehicle.fuelGrade,
    }});

    updateVehicles(items);
    await axios.post('/api/user/vehicleRanking', {
      email: user.email,
      vehicles: newVehicles
    }).then(response => {
      const newUser = response.data;
      updateUser(newUser);
  }).catch(error => {
      console.log(error.response.data.error);
      updateVehicles(oldVehicles);
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
          <StrictModeDroppable droppableId="vehicles">
            {(provided) => (
              <ul className="vehicles" style={{ textAlign: 'right'}} {...provided.droppableProps} ref={provided.innerRef}>
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
                            width: '100%',
                            boxShadow: (snapshot.isDragging || isClicked || id === hoveredItem) ? '0 4px 8px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                            cursor: snapshot.isDragging ? 'grabbing' : 'pointer',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <ArrowBackIosNewIcon style={{ fontSize: '36px', textAlign: 'right', cursor:'pointer'}}/>
                          <div className="vehicles-thumb">
                            <img src={thumb} alt={`${name} Thumb`} />
                          </div>
                          <div>
                          <p style={{ fontFamily: 'Arial', fontSize: '20px', textAlign: 'left', fontWeight: 'bold', color: '#8B008B'}}>
                          {ranking < rankNames.length? `${rankNames[ranking]}`:`${rankNames[rankNames.length - 1]}`}
                          </p>
                          <p style={{ fontFamily: 'Arial', fontSize: '16px', textAlign: 'right'}}>
                            { name }
                            <br />
                          </p>
                          </div>
                          <div className='delete-icon'>
                            <DeleteForeverIcon style={{ fontSize: '25px', textAlign: 'right', cursor:'pointer'}} onClick={(event) => handleRemoveCar(id, event)}/>
                          </div>
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
