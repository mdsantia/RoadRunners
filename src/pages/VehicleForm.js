import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

export default function VehicleForm() {
  const [open, setOpen] = React.useState(true);
  const [year, setYear] = React.useState('');
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');

  return (
    <Dialog open={open}>
        <DialogTitle>Vehicle Information</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Please enter the year, make, and model of the primary vehicle you would like to use for road trips.
            </DialogContentText>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                <InputLabel id="yearLabel">Year</InputLabel>
                <Select
                    name="year"
                    value={year}
                    onChange={event => setYear(event.target.value)}
                >
                </Select>
            </FormControl>
            <br></br>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                <InputLabel id="makeLabel">Make</InputLabel>
                <Select
                    name="make"
                    value={make}
                    onChange={event => setMake(event.target.value)}
                >
                </Select>
            </FormControl>  
            <br></br>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                <InputLabel id="modelLabel">Model</InputLabel>
                <Select
                    name="model"
                    value={model}
                    onChange={event => setModel(event.target.value)}
                />
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>OK</Button>
        </DialogActions>
    </Dialog>
  );
}
