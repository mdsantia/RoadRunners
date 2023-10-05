import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'; 
import { Typography, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Button, FormControl, Select, MenuItem, Grid, Divider, createTheme, ThemeProvider } from '@mui/material';
import VehicleForm from '../pages/VehicleForm.js';
import Logo from '../assets/rr-logo.png';
import { useUserContext } from '../hooks/useUserContext';
import axois from 'axios';

const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

export default function PreferencesForm() {
    const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const {user, updateUser} = useUserContext();
    const attractionOptions = ["Entertainment", "Outdoor/Nature", "Cultural", "Adventure", "Water", "Educational", "Shopping", "Culinary", "Religious", "Family-Friendly"];
    const diningOptions = ["Fast Food", "Fine Dining", "Casual Dining", "Cafés/Coffee Shops", "Buffets", "Food Trucks", "Family Restaurants", "Vegetarian/Vegan", "Ethnic/International", "Diners"];
    const housingOptions = ["Hotels", "Motels", "Bed and Breakfasts", "RV Parks & Campgrounds", "Vacation Rentals", "Hostels", "Resorts", "Roadside Inns & Lodges", "Cabins & Cottages"];
    const [open, setOpen] = React.useState(true);
    const [budget, setBudget] = React.useState('');
    const [commuteTime, setCommuteTime] = React.useState('');
    const [carsickRating, setCarsickRating] = React.useState('');
    const [attractionSelection, setAttractionSelection] = React.useState([]);
    const [diningSelection, setDiningSelection] = React.useState([]);
    const [housingSelection, setHousingSelection] = React.useState([]);

    const [budgetStatus, setBudgetStatus] = React.useState([]);
    const [commuteTimeStatus, setCommuteTimeStatus] = React.useState([]);
    
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

    const checkBudgetFormat = (input) => {
        const budgetRegex = /^\d+(\.\d{2})?$/;
        if (!budgetRegex.test(budget)) {
            setBudgetStatus("Please provide the budget in Dollar and Cents format (e.g., 100.00)");
            return false;
        } else {
            setBudgetStatus('');
            return true;
        }

    }

    const checkCommuteTimeFormat = (input) => {
        const commuteTimeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        if (commuteTime.length !== 0) {
            if (!commuteTimeRegex.test(commuteTime)) {
                setCommuteTimeStatus("Please provide the commute time in HH:MM format (e.g., 01:00)");
                return false;
            } else {
                setCommuteTimeStatus('');
                return true;
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let validBudget = false;
        let validCommuteTime = false;
        if (budget.length !== 0) {
            validBudget = checkBudgetFormat(budget);
        } else {
            validBudget = true;
        }
        if (commuteTime.length !== 0) {
            validCommuteTime = checkCommuteTimeFormat(commuteTime);
        } else {
            validCommuteTime = true;
        }
        if (validBudget && validCommuteTime) {
            setOpen(false);
            const preferences = {
                budget: budget,
                commuteTime: commuteTime,
                carsickRating: carsickRating,
                attractionSelection: attractionSelection,
                diningSelection: diningSelection,
                housingSelection: housingSelection
            }
            await axois.post('/api/user/setPreferences', {
                email: user.email,
                preferences: preferences
            } ).then((res) => {
                const newUser = res.data;
                updateUser(newUser);
                console.log("printing new user:", newUser)
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const handleSkip = () => {
        setOpen(false);
        setBudget('');
        setCommuteTime('');
        setCarsickRating('');
        setAttractionSelection([]);
        setDiningSelection([]);
        setHousingSelection([]);
        setBudgetStatus('');
        setCommuteTimeStatus('');
    }

    return (
        <ThemeProvider theme={theme}>
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
                        <img src={Logo} alt="Logo" width={200} style={{ padding: '10px'}}/>
                        <DialogTitle style={{ padding: '20px', margin: '0', fontSize: '25px' }}>Trip Preferences</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please indicate your trip preferences so that RoadRunners can suggest more personalized routes just for you.
                            </DialogContentText>
                            <br></br>
                            <Divider></Divider>
                            <br></br>
                            <FormControl sx={{ m: 1, minWidth: 500 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            style={{ margin: '0' }}
                                        >
                                            Preferred Budget for Road Trips
                                        </Typography>
                                    </div>                                    
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                        id="budget"
                                        variant="outlined"
                                        placeholder="Enter your budget in Dollar and Cents format (e.g., 100.00)"
                                        fullWidth
                                        inputProps={{ style: { height: '5px' } }}
                                        onChange={(event) => {
                                            setBudget(event.target.value);
                                        }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography
                                    color="error.main"
                                    justifyContent="flex-end"
                                    component="h1"
                                    variant="body2"
                                    sx={{ textAlign: 'right' }}
                                >
                                    {budgetStatus}
                                </Typography>                                
                                <br></br>
                                <Divider></Divider>
                                <br></br>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                    <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            style={{ margin: '0' }}
                                        >
                                            Preferred Maximum Commute Time Between Stops
                                        </Typography>
                                    </div>                                    
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                        id="commuteTime"
                                        variant="outlined"
                                        placeholder="Enter your commute time in HH:MM format (e.g., 01:00)"
                                        fullWidth
                                        inputProps={{ style: { height: '5px' } }}
                                        onChange={(event) => {
                                            setCommuteTime(event.target.value);
                                        }}
                                        />
                                    </Grid>
                                </Grid>
                                <Typography
                                    color="error.main"
                                    justifyContent="flex-end"
                                    component="h1"
                                    variant="body2"
                                    sx={{ textAlign: 'right' }}
                                >
                                    {commuteTimeStatus}
                                </Typography>   
                                <br></br>
                                <Divider></Divider>
                                <br></br>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                            <Typography
                                                variant="body1"
                                                fontWeight="bold"
                                                style={{ margin: '0' }}
                                            >
                                                Susceptibility to Motion Sickness
                                            </Typography> 
                                        </div> 
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Select
                                            name="carsickRating"
                                            value={carsickRating}
                                            sx={{ height: '38px' }}
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
                                <Divider></Divider>
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
                                <Divider></Divider>
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
                                <Divider></Divider>
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
                                <Button onClick={handleSkip} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'red', color: 'white', }}>
                                    Skip
                                </Button>
                            </Grid>
                            <Button onClick={handleSubmit} variant="contained" sx={{ width: '120px', backgroundColor: 'red', color: 'white', }}>
                                Done
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </>
        </ThemeProvider>
    );
}