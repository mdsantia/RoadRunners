import React, { useState } from 'react';
import axios from 'axios';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import StrictModeDroppable from './StrictModeDroppable';
import { useUserContext } from '../hooks/useUserContext';
import './CarRanking.css'

// const finalSpaceCharacters = [
//   {
//     id: 'gary',
//     name: 'Gary Goodspeed',
//     thumb: '/images/gary.png'
//   },
//   {
//     id: 'cato',
//     name: 'Little Cato',
//     thumb: '/images/cato.png'
//   },
//   {
//     id: 'kvn',
//     name: 'KVN',
//     thumb: '/images/kvn.png'
//   },
//   {
//     id: 'mooncake',
//     name: 'Mooncake',
//     thumb: '/images/mooncake.png'
//   },
//   {
//     id: 'quinn',
//     name: 'Quinn Ergon',
//     thumb: '/images/quinn.png'
//   }
// ]

function CarRanking() {
  // const [characters, updateCharacters] = useState(finalSpaceCharacters);
  const [vehicles, updateVehicles] = useState([]);
  const {user, updateUser} = useUserContext();

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
    
    // const items = Array.from(characters);
    const items = Array.from(vehicles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // updateCharacters(items);
    console.log(items);
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
      // if (response.status === 201) {
      //   alert("Your vehicle has been saved, but we could not find the MPG for your vehicle.\nPlease enter it manually.");
      // } else {
      //   alert("Your vehicle has been saved!");
      // }
  }).catch(error => {
      console.log(error.response.data.error);
      alert("There was an error saving your vehicle ranking: " + error.response.data.error + ".\nPlease try again.");
  });
  }

  return (
    <div className="Drag-Exam">
      <header className="Drag-Exam-header">
        <h4 style={{ color: 'darkblue' }}>Your Vehicles</h4>
        <div>Drag and drop for ranking. Click to load and edit.</div>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <StrictModeDroppable droppableId="characters">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {vehicles.map(({id, ranking, name, thumb}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="characters-thumb">
                            <img src={thumb} alt={`${name} Thumb`} />
                          </div>
                          <p style={{ fontFamily: 'Arial', fontSize: '16px' }}>
                            {ranking}: { name }
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
