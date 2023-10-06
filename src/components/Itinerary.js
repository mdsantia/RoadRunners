import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RouteIcon from '@mui/icons-material/Route';
import AttractionsIcon from '@mui/icons-material/Attractions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { Button, Grid, Divider, createTheme, ThemeProvider } from '@mui/material';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import { useUserContext } from '../hooks/useUserContext';
import axios from 'axios';
import RouteOptions from './RouteOptions';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Itinerary(props) {

  const {user, updateUser} = useUserContext();
 
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const attractionOptions = ["Entertainment", "Outdoor/Nature", "Cultural", "Adventure", "Water", "Educational", "Shopping", "Culinary", "Religious", "Family-Friendly"];
  const diningOptions = ["Fast Food", "Fine Dining", "Casual Dining", "Cafés/Coffee Shops", "Buffets", "Food Trucks", "Family Restaurants", "Vegetarian/Vegan", "Ethnic/International", "Diners"];
  const housingOptions = ["Hotels", "Motels", "Bed and Breakfasts", "RV Parks & Campgrounds", "Vacation Rentals", "Hostels", "Resorts", "Roadside Inns & Lodges", "Cabins & Cottages"];
  const vehicleOptions = ["Audi Q7"];
  const [open, setOpen] = React.useState(true);
  const [budget, setBudget] = React.useState(user ? user.preferences.budget : '');
  const [commuteTime, setCommuteTime] = React.useState(user ? user.preferences.commuteTime : '');
  const [carsickRating, setCarsickRating] = React.useState(user ? user.preferences.carsickRating : '');
  const [selectedVehicle, setSelectedVehicle] = React.useState( '');
  const [attractionSelection, setAttractionSelection] = React.useState(user ? user.preferences.attractionSelection : []);
  const [diningSelection, setDiningSelection] = React.useState(user ? user.preferences.diningSelection : []);
  const [housingSelection, setHousingSelection] = React.useState(user ? user.preferences.housingSelection : []);
  const [budgetStatus, setBudgetStatus] = React.useState([]); 
  const [commuteTimeStatus, setCommuteTimeStatus] = React.useState([]);

  React.useEffect(() => {
    if (!user) {
      return;
    } 
    setBudget(user.preferences.budget);
    setCommuteTime(user.preferences.commuteTime);
    setCarsickRating(user.preferences.carsickRating);
    setAttractionSelection(user.preferences.attractionSelection);
    setDiningSelection(user.preferences.diningSelection);
    setHousingSelection(user.preferences.housingSelection);
  }, [user]);

  const numOptionsPerColumn = 10;
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

  const saveTrip = async () => {
    console.log(props)
    await axios.post('/api/user/saveTrip', {
      email: user.email,
      startLocation: props.startLocation,
      endLocation: props.endLocation,
      startDate: props.startDate,
      endDate: props.endDate,
      vehicleList: [],
    }).then((response) => {
       const newUser = response.data;
       updateUser(newUser);
       alert("Trip saved!");
    }
    ).catch((error) => {
      console.log(error);
    });
  }

  const handleSubmit = (event) => {
   /*generate route*/
  }

  return (
    <Box sx={{ width: '100%', paddingTop: '15%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab icon={<FavoriteIcon />} label="Preferences" {...a11yProps(0)} />
          <Tab icon={<RouteIcon />} label="Routes" {...a11yProps(1)} />
          <Tab icon={<AttractionsIcon />} label="Attractions" {...a11yProps(2)} />
          <Tab icon={<FormatListNumberedIcon />} label="Overview" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
          <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    style={{ margin: '0' }}
                  >
                    Preferred Vehicle for Road Trip
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <Select
                  name="selectedVehicle"
                  value={selectedVehicle}
                  sx={{ height: '38px' }}
                  onChange={(event) => {
                    setSelectedVehicle(event.target.value);
                  }}
                  fullWidth
                >
                  {vehicleOptions.map((selectedVehicle, index) => (
                    <MenuItem key={index} value={selectedVehicle}>
                     {selectedVehicle}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <br></br>
            <Divider></Divider>
            <br></br>
            <Grid container spacing={2} alignItems="center">
              
              <Grid item xs={10} md={4}>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    style={{ margin: '0' }}
                  >
                    Preferred Budget for Road Trip
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={8}>
                <TextField
                  id="budget"
                  variant="outlined"
                  placeholder="Enter your budget in Dollar and Cents format (e.g., 100.00)"
                  fullWidth
                  value={budget}
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
                    value={commuteTime}
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
              component="h3"
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
                  <Grid item xs={15} key={columnIndex}>
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
                  <Grid item xs={15} key={columnIndex}>
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
                  <Grid item xs={15} key={columnIndex}>
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
        </div>
        <Button  onClick={handleSubmit} variant="contained" endIcon={<AddRoadIcon />} sx={{m:2}}>
          Generate Route
        </Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Route options
        <RouteOptions/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Attraction list
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Button variant="contained" sx={{m:2}} onClick={saveTrip} >
          Save Trip
        </Button>
      </TabPanel>
    </Box>
  );
}


