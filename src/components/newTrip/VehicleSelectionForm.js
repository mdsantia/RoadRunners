import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Typography,
  Divider,
} from '@mui/material';


function VehicleSelectionForm({ vehicleList, numVehicles, selectedVehicles, setNumVehicles, setSelectedVehicles, minMPG, setMinMPG, viewOnly }) {
  const [selectedVehiclesMPG, setSelectedVehiclesMPG] = useState([]);
  const handleNumVehiclesChange = (event) => {
      const newValue = parseInt(event.target.value, 10);

      if (isNaN(newValue) || newValue > vehicleList.length ) {
          return;
      }
      setNumVehicles(newValue);
      setSelectedVehicles([]);
      setSelectedVehiclesMPG([]);
  };

  const getMinMpg = () => {
    let min = Infinity;
    for (let i = 0; i < selectedVehiclesMPG.length; i++) {
      if (selectedVehiclesMPG[i] === -1)
        continue;
      if (selectedVehiclesMPG[i] < min)
        min = selectedVehiclesMPG[i];
    }

    if (min === Infinity) {
      return 0;
    }
    return min;
  }

  const handleVehicleSelectChange = (event) => {
    if (event.target.value.length <= numVehicles) {
      const selectedValues = event.target.value;
      const selectedMPGValues = selectedValues.map((selectedValue) => {
      const selectedVehicle = vehicleList.find((vehicle) => vehicle.name === selectedValue);
        return selectedVehicle ? parseInt(selectedVehicle.mpg) : 0; // Set a default value as needed
      });;
      setSelectedVehicles(selectedValues);
      setSelectedVehiclesMPG(selectedMPGValues);
      setMinMPG(getMinMpg());
    }
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 500 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <Typography variant="body1" fontWeight="bold" style={{ margin: '0' }}>
              Number of Vehicles
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            id="num-vehicles"
            type="number"
            variant="outlined"
            disabled={viewOnly}
            value={numVehicles }
            fullWidth
            inputProps={{
              min: 0,
              max: vehicleList.length,
              style: { height: '16px' },

            }}
            onChange={handleNumVehiclesChange}
          />
        </Grid>
      </Grid>
      <br></br>
      <Divider />
      <br></br>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <Typography variant="body1" fontWeight="bold" style={{ margin: '0' }}>
              Select Vehicles
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Select
            id="vehicle-select"
            multiple
            disabled={viewOnly}
            value={selectedVehicles}
            onChange={handleVehicleSelectChange}
            fullWidth
            sx={{ height: '38px' }}
          >
            {vehicleList.map((vehicle,index ) => (
              <MenuItem id={index} key={index} value={vehicle.name} mpg={vehicle.mpg<=0?Infinity:vehicle.mpg}>
                {vehicle.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
            <Typography variant="body1" fontWeight="bold" style={{ margin: '0' }}>
              Your Trip MPG
            </Typography>
          </div>
        </Grid>
        <br></br>
        <Divider />
        <br></br>
        <Grid item xs={12} md={8}>
          {selectedVehiclesMPG.length === 0 ? (
            <p>No vehicle selected</p>
          ):(
          <p>{minMPG === 0 ? '20' : minMPG}</p> )}
          {/* <p>{selectedVehiclesMPG.length==0?'No vehicle selected':(Math.min(selectedVehiclesMPG)==Infinity?'Missing MPG':Math.min(selectedVehiclesMPG))}</p> */}
        </Grid>
      </Grid>
    </FormControl>
  );
}

export default VehicleSelectionForm;
