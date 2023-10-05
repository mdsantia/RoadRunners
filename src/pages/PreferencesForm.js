import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'; 
import { Typography, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Button, FormControl, Select, MenuItem, Grid } from '@mui/material';
import VehicleForm from '../pages/VehicleForm.js';

export default function PreferencesForm() {
    const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const attractionOptions = ["Entertainment", "Outdoor/Nature", "Cultural", "Adventure", "Water", "Educational", "Shopping", "Culinary", "Religious", "Family-Friendly"];
    const diningOptions = ["Fast Food", "Fine Dining", "Casual Dining", "Cafés/Coffee Shops", "Buffets", "Food Trucks", "Family Restaurants", "Vegetarian/Vegan", "Ethnic/International", "Diners"];
    const housingOptions = ["Hotels", "Motels", "Bed and Breakfasts", "RV Parks & Campgrounds", "Vacation Rentals", "Hostels", "Resorts", "Roadside Inns & Lodges", "Cabins & Cottages"];
    const [open, setOpen] = React.useState(true);
    const [budget, setBudget] = React.useState(0);
    const [commuteTime, setCommuteTime] = React.useState('');
    const [carsickRating, setCarsickRating] = React.useState(0);
    const [attractionSelection, setAttractionSelection] = React.useState([]);
    const [diningSelection, setDiningSelection] = React.useState([]);
    const [housingSelection, setHousingSelection] = React.useState([]);

    
    const numOptionsPerColumn = 3;
    const findTotalColumns = (optionsList) => {
        return Math.ceil(optionsList.length / numOptionsPerColumn);
    }

    const handleAttractionSelection = (event) => {
        if (attractionSelection.includes(event.target.value)) {
            // REMOVES ATTRACTION IF ALREADY SELECTED (DESELECTION)
            setAttractionSelection(attractionSelection.filter((attraction) => attraction !== event.target.value));
        } else {
            // ADDS ATTRACTION IF NOT ALREADY SELECTED (SELECTION)
            setAttractionSelection([...attractionSelection, event.target.value]);
        }
    }

    const handleDiningSelection = (event) => {
        if (diningSelection.includes(event.target.value)) {
            // REMOVES DINING CHOICE IF ALREADY SELECTED (DESELECTION)
            setDiningSelection(diningSelection.filter((diningPlace) => diningPlace !== event.target.value));
        } else {
            // ADDS DINING CHOICE IF NOT ALREADY SELECTED (SELECTION)
            setDiningSelection([...diningSelection, event.target.value]);
        }
    }

    const handleHousingSelection = (event) => {
        if (housingSelection.includes(event.target.value)) {
            // REMOVES HOUSING CHOICE IF ALREADY SELECTED (DESELECTION)
            setHousingSelection(housingSelection.filter((housingChoice) => housingChoice !== event.target.value));
        } else {
            // ADDS HOUSING CHOICE IF NOT ALREADY SELECTED (SELECTION)
            setHousingSelection([...housingSelection, event.target.value]);
        }
    }

    const handleSubmit = () => {
        setOpen(false);
    }

    const handleSkip = () => {
        setOpen(false);
        /* SEND DEFAULT DATA TO BACKEND TO INDICATE NO PREFERENCES CHOSEN */
    }

    return (
        <>
            {/* ADDS BACKGROUND BLUR EFFECT */}
            {open && (
                <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(5px)',
                    zIndex: 999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                />
            )}
            {/* OPENS VEHICLE FORM AFTER PREFERENCE FORM IS FILLED OUT */}
            {!open ? (
                <VehicleForm />
            ) : ( 
                <Dialog open={open} fullWidth maxWidth="md">
                    <DialogTitle>Trip Preferences</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please indicate your trip preferences so that RoadRunners can suggest more personalized routes just for you.
                        </DialogContentText>
                        <FormControl sx={{ m: 5, minWidth: 300 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body1" fontWeight="bold">Preferred Budget for Road Trips</Typography>
                                    <TextField
                                        id="budget"
                                        variant="outlined"
                                        placeholder="Enter Budget (e.g., 100.00)"
                                        fullWidth
                                        onChange={(event) => {
                                            setBudget(event.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body1" fontWeight="bold">Preferred Maximum Commute Time Between Stops</Typography>
                                    <TextField
                                        id="commuteTime"
                                        variant="outlined"
                                        placeholder="Enter Time (e.g., 1:00)"
                                        fullWidth
                                        onChange={(event) => {
                                            setCommuteTime(event.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Typography variant="body1" fontWeight="bold">
                                        Susceptibility to Motion Sickness
                                    </Typography>  
                                    <Select
                                        name="carsickRating"
                                        value={carsickRating}
                                        onChange={(event) => {
                                            setCarsickRating(event.target.value);
                                        }}
                                        fullWidth
                                    >
                                        {ratingOptions.map((ratingOption, index) => (
                                            <MenuItem key={index} value={ratingOption}>
                                                {ratingOption === 1 ? "1 (Not Susceptible)" : ratingOption === 10 ? "10 (Extremely Susceptible)" : ratingOption}
                                            </MenuItem>
                                        ))}
                                    </Select>      
                                </Grid>
                            </Grid>
                            <br></br>
                            <Typography variant="body1" fontWeight="bold">
                            What type of attractions would you prefer to visit during your road trip? 
                            Select all that apply.
                            </Typography>
                            <FormGroup>
                                <Grid container>
                                    {Array.from({ length: findTotalColumns(attractionOptions) }).map((_, columnIndex) => (
                                        <Grid item xs={3} key={columnIndex}>
                                            {attractionOptions.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((attraction, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                <Checkbox
                                                    checked={attractionSelection.includes(attraction)}
                                                    onChange={handleAttractionSelection}
                                                    value={attraction}
                                                />
                                                }
                                                label={attraction}
                                            />
                                            ))}
                                        </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>
                            <br></br>
                            <Typography variant="body1" fontWeight="bold">
                            What are your dining preferences? Select all that apply.
                            </Typography>
                            <FormGroup>
                                <Grid container>
                                    {Array.from({ length: findTotalColumns(diningOptions) }).map((_, columnIndex) => (
                                        <Grid item xs={3} key={columnIndex}>
                                            {diningOptions.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((diningPlace, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={
                                                <Checkbox
                                                    checked={diningSelection.includes(diningPlace)}
                                                    onChange={handleDiningSelection}
                                                    value={diningPlace}
                                                />
                                                }
                                                label={diningPlace}
                                            />
                                            ))}
                                        </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>
                            <br></br>
                            <Typography variant="body1" fontWeight="bold">
                            What are your housing preferences? Select all that apply.
                            </Typography>
                            <FormGroup>
                                <Grid container>
                                    {Array.from({ length: findTotalColumns(housingOptions) }).map((_, columnIndex) => (
                                        <Grid item xs={3} key={columnIndex}>
                                            {housingOptions.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((housingChoice, index) => (
                                                <div key={index}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={housingSelection.includes(housingChoice)}
                                                                onChange={handleHousingSelection}
                                                                value={housingChoice}
                                                            />
                                                        }
                                                        label={housingChoice}
                                                    />
                                                </div>
                                            ))}
                                        </Grid>
                                    ))}
                                </Grid>
                            </FormGroup>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px', justifyContent: 'space-between' }}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={handleSkip} variant="contained" color="primary" sx={{ width: '120px' }}>
                                Skip
                            </Button>
                        </Grid>
                        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ width: '120px' }}>
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}