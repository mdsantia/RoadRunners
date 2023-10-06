import React from 'react';
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


function VehicleSelectionForm({ vehicleList, numVehicles, selectedVehicles, setNumVehicles, setSelectedVehicles }) {

    const handleNumVehiclesChange = (event) => {
        const newValue = parseInt(event.target.value, 10);

        if (isNaN(newValue) || newValue > vehicleList.length ) {
            return;
        }
        setNumVehicles(newValue);
        setSelectedVehicles([]);
    };

    const handleVehicleSelectChange = (event) => {
        console.log(numVehicles);
        if (event.target.value.length <= numVehicles) {
            setSelectedVehicles(event.target.value);
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
            value={numVehicles }
            fullWidth
            inputProps={{
              min: 1,
              max: vehicleList.length,
              style: { height: '16px' },

            }}
            onChange={handleNumVehiclesChange}
          />
        </Grid>
      </Grid>
      <Divider />
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
            value={selectedVehicles}
            onChange={handleVehicleSelectChange}
            fullWidth
            sx={{ height: '38px' }}
          >
            {vehicleList.map((vehicle) => (
              <MenuItem key={vehicle} value={vehicle}>
                {vehicle}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </FormControl>
  );
}

export default VehicleSelectionForm;
