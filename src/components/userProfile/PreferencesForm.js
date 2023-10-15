import * as React from 'react';
import { Typography, TextField, FormGroup, FormControlLabel, Checkbox, Container } from '@mui/material';
import { Button, FormControl, Select, MenuItem, Grid, Divider, createTheme, ThemeProvider } from '@mui/material';
import Logo from '../../assets/rr-logo.png';
import { useUserContext } from '../../hooks/useUserContext';
import axois from 'axios';

export default function PreferencesForm(props) {
    const {user, updateUser} = useUserContext();
    const inDashboard = props.type == 'dashboard';

    React.useEffect(() => {
        if (!user) {
          return;
        } 
        setBudget(user.preferences.budget ? user.preferences.budget : '');
        setCommuteTime(user.preferences.commuteTime ? user.preferences.commuteTime : '');
        setCarsickRating(user.preferences.carsickRating ? user.preferences.carsickRating : '');
        setAttractionSelection(user.preferences.attractionSelection ? user.preferences.attractionSelection : [] );
        setDiningSelection(user.preferences.diningSelection ? user.preferences.diningSelection : []);
        setHousingSelection(user.preferences.housingSelection ? user.preferences.housingSelection : []);
    }, [user]);

    const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const attractionOptions = [
        "Entertainment", 
        "Outdoor/Nature", 
        // "Cultural", 
        "Adventure", 
        // "Water", 
        // "Educational", 
        "Shopping", 
        // "Culinary", 
        // "Religious", 
        // "Family-Friendly"
    ];
    const diningOptions = [
        "Fast Food", 
        // "Fine Dining", 
        // "Casual Dining", 
        "Cafés/Coffee Shops", 
        // "Buffets", 
        // "Food Trucks", 
        "Family Restaurants", 
        // "Vegetarian/Vegan", 
        // "Ethnic/International", 
        // "Diners"
    ];
    const housingOptions = [
        "Hotels", 
        "Motels", 
        // "Hostels", 
        "Airbnb", 
        // "Vacation Rentals", 
        // "Resorts", 
        // "Roadside Inns & Lodges", 
        // "Cabins", 
        // "Cottages"
    ];
    const [budget, setBudget] = React.useState( '');
    const [commuteTime, setCommuteTime] = React.useState( '');
    const [carsickRating, setCarsickRating] = React.useState( '');
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
                alert("Your preferences have been updated!");
                console.log("printing new user:", newUser)
            }).catch((err) => {
                console.log(err);
            });
            if (props.showSkipButton) {
                props.onClose();
            }
        }
    }

    const handleSkip = async () => {
        setBudget('');
        setCommuteTime('');
        setCarsickRating('');
        setAttractionSelection([]);
        setDiningSelection([]);
        setHousingSelection([]);
        setBudgetStatus('');
        setCommuteTimeStatus('');
        props.onClose();
    }

    return (
        <>
            {props.showLogo && (
                <img src={Logo} alt="Logo" width={200}/>
            )}
            <div style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Trip Preferences</Typography>
                <br></br>
                <Container>
                    <Typography variant="body1">
                        Please indicate your trip preferences so that RoadRunners can suggest more personalized routes just for you.
                    </Typography>
                    <br></br>
                    <Divider></Divider>
                    <br></br>
                    {/* <FormControl sx={{ m: 1, minWidth: 500 }}> */}
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
                                value={budget}
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
                                value={commuteTime}
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
                                    <Grid item xs={4} key={columnIndex}>
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
                                            sx={{ display: 'flex', alignItems: 'center' }}
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
                                    <Grid item xs={4} key={columnIndex}>
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
                                            sx={{ display: 'flex', alignItems: 'center' }}
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
                                                    sx={{ display: 'flex', alignItems: 'center' }}
                                                />
                                            </div>
                                        ))}
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    {/* </FormControl> */}
                </Container>
                <Container style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    {props.showSkipButton && (
                        <Button onClick={handleSkip} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'darkblue', color: 'white' }}>
                            Skip
                        </Button>
                    )}
                    {props.showDoneButton && (
                        <Button onClick={handleSubmit} variant="contained" sx={{ width: '120px', backgroundColor: 'darkblue', color: 'white' }}>
                            Done
                        </Button>
                    )}
                </Container>
            </div>
        </>
    );
}