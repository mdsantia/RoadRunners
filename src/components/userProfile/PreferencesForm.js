import * as React from 'react';
import { Typography, TextField, FormGroup, FormControlLabel, Checkbox, Container } from '@mui/material';
import { Button, Select, MenuItem, Grid, Divider, Snackbar, Paper } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Logo from '../../assets/rr-logo.png';
import { useUserContext } from '../../hooks/useUserContext';
import axois from 'axios';
import { useDashboardContext } from '../../hooks/useDashboardContext';

export default function PreferencesForm(props) {
    const {user, updateUser} = useUserContext();
    const inDashboard = props.type === 'dashboard';
    const {tripDetails} = useDashboardContext();
    const viewOnly = props.viewOnly;
    
    const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const attractionOptions = [
        "Entertainment", 
        "Nature", 
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
        "Coffee Shops", 
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

    React.useEffect(() => {
        if (!user) {
          return;
        } 
        const local = user.preferences.attractionSelection ? user.preferences.attractionSelection : [];
        setAttractionSelection(local);
        setBudget(user.preferences.budget ? user.preferences.budget : '');
        setCommuteTime(user.preferences.commuteTime ? user.preferences.commuteTime : '');
        setCarsickRating(user.preferences.carsickRating ? user.preferences.carsickRating : '');
        setDiningSelection(user.preferences.diningSelection ? user.preferences.diningSelection : []);
        setHousingSelection(user.preferences.housingSelection ? user.preferences.housingSelection : []);
        const keywords = local.filter((attraction) => !attractionOptions.includes(attraction));
        setAttractionKeywords(keywords);
    }, [user]);
    
    React.useEffect(() => {
        if (!tripDetails || !inDashboard) {
            return;
        }
        if (!tripDetails.preferences) {
            return;
        }
        const local = tripDetails.preferences.attractionSelection ? tripDetails.preferences.attractionSelection : attractionSelection;
        setAttractionSelection(local);
        setBudget(tripDetails.preferences.budget ? tripDetails.preferences.budget : budget);
        setCommuteTime(tripDetails.preferences.commuteTime ? tripDetails.preferences.commuteTime : commuteTime);
        setCarsickRating(tripDetails.preferences.carsickRating ? tripDetails.preferences.carsickRating : carsickRating);
        setDiningSelection(tripDetails.preferences.diningSelection ? tripDetails.preferences.diningSelection : diningSelection);
        setHousingSelection(tripDetails.preferences.housingSelection ? tripDetails.preferences.housingSelection : housingSelection);
        const keywords = local.filter((attraction) => !attractionOptions.includes(attraction));
        setAttractionKeywords(keywords);
    }, [tripDetails]);

    const [budget, setBudget] = React.useState('');
    const [commuteTime, setCommuteTime] = React.useState('');
    const [carsickRating, setCarsickRating] = React.useState('');
    const [attractionSelection, setAttractionSelection] = React.useState([]);
    const [diningSelection, setDiningSelection] = React.useState([]);
    const [housingSelection, setHousingSelection] = React.useState([]);
    const [budgetStatus, setBudgetStatus] = React.useState([]); 
    const [commuteTimeStatus, setCommuteTimeStatus] = React.useState([]);
    const [attractionKeywords, setAttractionKeywords] = React.useState([]);
    const [keyword, setKeyword] = React.useState('');
    const [expandedKeywords, setExpandedKeywords] = React.useState([]);
    
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

    const handleAddingKeywords = () => {
        setAttractionSelection([...attractionSelection, keyword]);
        setAttractionKeywords(prevKeywords => [...prevKeywords, keyword]);
        setKeyword('');
    }

    const handleDeleteKeywords = (keyword) => {
        setAttractionSelection(attractionSelection.filter((attraction) => attraction !== keyword));
        const updatedKeywords = attractionKeywords.filter((attractionKeyword) => attractionKeyword !== keyword);
        setAttractionKeywords(updatedKeywords);
    }

    const handleKeywordExpand = (clickedKeyword) => {
        if (expandedKeywords.includes(clickedKeyword)) {
            setExpandedKeywords(expandedKeywords.filter((keyword) => keyword !== clickedKeyword));
        } else {
            setExpandedKeywords([...expandedKeywords, clickedKeyword]);
        }
    };

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

    const handleSave = async (event) => {
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
                console.log("printing new user:", newUser)
            }).catch((err) => {
                console.log(err);
            });
            if (props.showSkipButton) {
                props.onClose();
            }
        }
        if(props.handleSave) {
            props.handleSave();
        }
    }

    const handleCancel = async () => {
        props.handleCancel();
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

    const handleDashboardSave = async (event) => {
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
            props.setDashboardPrefs(preferences);
        }
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
                    {inDashboard ? (
                        <Typography variant="body1">
                            Changing these preferences will only affect this current trip and not your profile preferences.
                        </Typography>
                    ) : (
                        <Typography variant="body1">
                            Please indicate your trip preferences so that RoadRunners can suggest more personalized routes just for you.
                        </Typography>
                    )}
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
                                disabled={viewOnly}
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
                                disabled={viewOnly}
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
                                    disabled={viewOnly}
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
                                                disabled={viewOnly}
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
                        <br></br>
                        <Typography variant="body1" fontWeight="bold">
                            Please specify any keywords for attractions you would like to add along your route:
                        </Typography>
                        <br></br>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={10} sm={10} md={10}>
                                <TextField
                                    placeholder="Enter keywords for attractions"
                                    variant="outlined"
                                    value={keyword}
                                    fullWidth
                                    inputProps={{ style: { height: '5px' } }}
                                    onChange={(event) => setKeyword(event.target.value)}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={2} sm={2} md={2} alignItems="center" style={{ display: 'flex' }}>
                                <Button
                                    sx={{
                                        borderRadius: '10px',
                                        border: '1px solid #ccc',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                        backgroundColor: 'darkblue',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#6495ed',
                                        },
                                    }}
                                    onClick={handleAddingKeywords}
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                        <br></br>
                        <Typography variant="body1" fontWeight="bold">
                            Keywords Added:
                        </Typography>
                        {attractionKeywords.length ? (
                            <Grid container spacing={2}>
                                {attractionKeywords.map((keyword, index) => (
                                    <Grid item key={index} xs={3} sm={3} md={3} style={{ maxWidth: '25%', flexBasis: '25%' }}>
                                        <Paper 
                                            style={{
                                                padding: '2%',
                                                textAlign: 'center',
                                                minWidth: '80px',
                                                maxWidth: '100%',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                wordWrap: 'break-word',
                                                height: 'auto',
                                            }}
                                            onClick={() => handleKeywordExpand(keyword)}
                                        >
                                            <Grid container spacing={0} alignItems="center">
                                                <Grid item xs={9} sm={9} md={9} 
                                                    style={{ 
                                                        paddingLeft: '5px', 
                                                        overflow: expandedKeywords.includes(keyword) ? '' : 'hidden', 
                                                        textOverflow: expandedKeywords.includes(keyword) ? '' : 'ellipsis', 
                                                        overflowWrap: expandedKeywords.includes(keyword) ? '' : 'break-word',
                                                        wordWrap: expandedKeywords.includes(keyword) ? '' : 'break-word',
                                                        whiteSpace: expandedKeywords.includes(keyword) ? 'normal' : 'nowrap', 
                                                    }}
                                                >
                                                    {keyword}
                                                </Grid>
                                                <Grid item xs={3} sm={3} md={3}>
                                                    <HighlightOffIcon 
                                                        style={{ paddingRight: '5px', marginLeft: '5px', verticalAlign: 'middle', fontSize: '18px', cursor: "pointer" }} 
                                                        onClick={() => handleDeleteKeywords(keyword)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : ( <i>No Keywords Specified</i> )}
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
                                                disabled={viewOnly}
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
                                                            disabled={viewOnly}
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
                        <Button onClick={handleSkip} variant="contained" sx={{ width: '120px', backgroundColor: 'darkblue', color: 'white' }}>
                            Skip
                        </Button>
                    )}
                    {props.showSaveButton && (
                        <Button onClick={handleSave} variant="contained" sx={{ width: '120px', backgroundColor: 'darkblue', color: 'white' }}>
                            Save
                        </Button>
                    )}
                    {props.showCancelButton && (
                        <Button onClick={handleCancel} variant="contained" sx={{ width: '120px', backgroundColor: 'darkblue', color: 'white' }}>
                            Cancel
                        </Button>
                    )}
                    {inDashboard && (
                        <Button onClick={handleDashboardSave} disabled={viewOnly} variant="contained" sx={{ width: '180px', backgroundColor: 'darkblue', color: 'white' }}>
                            Re-Generate Trip
                        </Button>
                    )} 
                </Container>
            </div>
        </>
    );
}