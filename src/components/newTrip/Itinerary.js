import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RouteIcon from '@mui/icons-material/Route';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { Button } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useTripContext } from '../../hooks/useTripContext';
import axios from 'axios';
import PreferencesForm from '../userProfile/PreferencesForm';
import { json, useNavigate } from 'react-router-dom';
import VehicleSelectionForm from '../newTrip/VehicleSelectionForm';
import RouteOptions from './RouteOptions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AttractionsList from '../newTrip/AttractionsList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        overflowY: 'auto', // Add vertical scrollbar when content overflows
        maxHeight: '450px', // Set a maximum height to control the scrollbar
      }}
    >
      {value === index ? (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      ) : null}
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

export default function Itinerary() {

  /* Feedback Message stuff */
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarDuration, setSnackbarDuration] = React.useState(2000);
  const showMessage = (message, duration, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarDuration(duration);
    setSnackbarOpen(true);
  };
  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const {user, updateUser} = useUserContext();
  const navigate = useNavigate();
  const {tripDetails} = useTripContext();
  const [temporaryPrefs, setTemporaryPrefs] = React.useState({});
 
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [vehicleList, setVehicleList] = React.useState([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
  const [numVehicles, setNumVehicles] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      setVehicleList(user.vehicles.map((vehicle) => {return {name: `${vehicle.color} ${vehicle.year} ${vehicle.make} ${vehicle.model}`, mpg: vehicle.mpg}}));
    }
  }, [user]);

  React.useEffect(() => {
    if (tripDetails) {
      setNumVehicles(parseInt(tripDetails.numVehicles));
      setSelectedVehicles(tripDetails.selectedVehicles);
      setTemporaryPrefs(tripDetails.preferences);
    }
  }, [tripDetails]);

  const numOptionsPerColumn = 10;
  const findTotalColumns = (optionsList) => {
    return Math.ceil(optionsList.length / numOptionsPerColumn);
  }

  const saveTrip = async (isNewTrip) => {
    await axios.post('/api/user/saveTrip', {
      email: user.email,
      hash: btoa(JSON.stringify({tripDetails})),
      id: isNewTrip ? null : (tripDetails.id ? tripDetails.id : null)
    }).then((response) => {
       const newUser = response.data;
       updateUser(newUser);
       isNewTrip ? showMessage('Trip saved successfully!', 2000, 'success') : showMessage('Trip updated successfully!', 2000, 'success');
       if(isNewTrip){
        const encodedTripDetails = newUser.trips[newUser.trips.length - 1].hash;
        navigate(`/dashboard/${encodedTripDetails}`);
        
       }
    }
    ).catch((error) => {
      console.log(error);
    });
  }

  const handleGenerate = () => {
    const newTripDetails = {
      ...tripDetails,
      preferences: temporaryPrefs,
      numVehicles: numVehicles,
      selectedVehicles: selectedVehicles
    }
    const encodedTripDetails = btoa(JSON.stringify({tripDetails: newTripDetails}));
    navigate(`/dashboard/${encodedTripDetails}`);
    window.location.reload();
  }

  return (
    <Box sx={{ width: '100%', paddingTop: '15%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab icon={<FavoriteIcon />} label="Preferences" {...a11yProps(0)} />
          <Tab icon={<RouteIcon />} label="Routes" {...a11yProps(1)} />
          <Tab icon={<AddLocationAltIcon />} label="Stops" {...a11yProps(2)} />
          <Tab icon={<FormatListNumberedIcon />} label="Overview" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <VehicleSelectionForm
          vehicleList={vehicleList}
          numVehicles={numVehicles}
          selectedVehicles={selectedVehicles}
          setNumVehicles={setNumVehicles}
          setSelectedVehicles={setSelectedVehicles}
        />
        <PreferencesForm setDashboardPrefs={setTemporaryPrefs} type={'dashboard'} showSkipButton={false} showDoneButton={false} showLogo={false}/>
        <Button variant="contained" sx={{m:2}} onClick={handleGenerate} >
          Re-Generate Trip
        </Button> 
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RouteOptions/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AttractionsList></AttractionsList>
      </TabPanel>
      <TabPanel value={value} index={3}>
        {(tripDetails && tripDetails.id) ?  (
          <>
            <Button variant="contained" sx={{m:2}} onClick={() => saveTrip(false)} >
              Update Trip
            </Button>
            <Button variant="contained" sx={{m:2}} onClick={() => saveTrip(true)} >
              Save as New Trip
            </Button>   
          </>
          ):(     
            <Button variant="contained" sx={{m:2}} onClick={() => saveTrip(true)} >
              Save Trip
            </Button> 
          )}  
      </TabPanel>
      <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>      
    </Box>
  );
}


