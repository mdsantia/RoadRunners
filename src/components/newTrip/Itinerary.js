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
import { Button, Divider, Container } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import axios from 'axios';
import PreferencesForm from '../userProfile/PreferencesForm';
import { useNavigate } from 'react-router-dom';
import VehicleSelectionForm from '../newTrip/VehicleSelectionForm';
import RouteOptions from './RouteOptions';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AttractionsList from '../newTrip/AttractionsList';
import {useDashboardContext} from '../../context/DashboardContext'
import TripOverview from '../newTrip/TripOverview'

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
      {value === index ? (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
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
  const {tripDetails, setTripDetails} = useDashboardContext();
  const [temporaryPrefs, setTemporaryPrefs] = React.useState({});
 
  const [value, setValue] = React.useState(1);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [vehicleList, setVehicleList] = React.useState([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
  const [numVehicles, setNumVehicles] = React.useState(0);
  const [minimumMPG, setMinimumMPG] = React.useState(0);

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
      setMinimumMPG(tripDetails.minimumMPG);
    }
  }, [tripDetails]);

  const numOptionsPerColumn = 10;
  const findTotalColumns = (optionsList) => {
    return Math.ceil(optionsList.length / numOptionsPerColumn);
  }

  const saveTrip = async (isNewTrip) => {
    await axios.post('/api/trip/saveTrip', {
      id: isNewTrip ? null : tripDetails.id,
      startLocation: tripDetails.startLocation,
      endLocation: tripDetails.endLocation,
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
      preferences: temporaryPrefs,
      numVehicles: numVehicles,
      selectedVehicles: selectedVehicles,
      allStops: tripDetails.allStops,
      options: tripDetails.options,
      chosenRoute: tripDetails.chosenRoute,
      polyline: tripDetails.polyline,
      stops: tripDetails.stops,
      user_email: user.email,
    }).then((res) => {
      if (isNewTrip) {
        showMessage('Trip saved!', 2000, 'success');
      } else {
        showMessage('Trip updated!', 2000, 'success');
      }
      updateUser(res.data.user);
      const oldid = tripDetails.tempid;
      if (oldid) {
        const tempTrips = JSON.parse(localStorage.getItem('tempTrips')) || {};
        delete tempTrips[oldid];
        localStorage.setItem('tempTrips', JSON.stringify(tempTrips));
        navigate(`/dashboard/${res.data.id}`);
      }
    }).catch((err) => {
      console.log(err);
      showMessage('Error saving trip', 2000, 'error');
    });
  }

  const shareTrip = async (trip) => {
    // await axios.post('/api/user/shareTrip', {
    //   tripId: trip,
    //   permission: false,
    //   // shareTo: 'jjennyha18@gmail.com'
    // }).then((response) => {
    //    const data = response.data;
    // }
    // ).catch((error) => {
    //   console.log(error);
    // });
  }

  const handleGenerate = () => {
    const newTripDetails = {
      ...tripDetails,
      preferences: temporaryPrefs,
      numVehicles: numVehicles,
      selectedVehicles: selectedVehicles,
    }
    const tripDetailsToHash = {
      startLocation: tripDetails.startLocation,
      endLocation: tripDetails.endLocation,
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
      preferences: newTripDetails.preferences,
      numVehicles: newTripDetails.numVehicles,
      selectedVehicles: newTripDetails.selectedVehicles,
      minimumMPG: tripDetails.minimumMPG,
    }
    if (tripDetails.id) {
      tripDetailsToHash.id = tripDetails.id;
    }
    const encodedTripDetails = btoa(JSON.stringify({tripDetails: tripDetailsToHash}));
    navigate(`/dashboard/${encodedTripDetails}`);
  }

  return (
    <Box sx={{ width: '100%', paddingTop: '14%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab icon={<FavoriteIcon />} label="Preferences" {...a11yProps(0)} />
          <Tab icon={<RouteIcon />} label="Routes" {...a11yProps(1)} />
          <Tab icon={<AddLocationAltIcon />} label="Stops" {...a11yProps(2)} />
          <Tab icon={<FormatListNumberedIcon />} label="Overview" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box     style={{
        overflowY: 'auto', // Add vertical scrollbar when content overflows
        maxHeight: '450px', // Set a maximum height to control the scrollbar
      }}>
        <VehicleSelectionForm
          vehicleList={vehicleList}
          numVehicles={numVehicles}
          selectedVehicles={selectedVehicles}
          setNumVehicles={setNumVehicles}
          setSelectedVehicles={setSelectedVehicles}
          minMPG={minimumMPG}
          setMinMPG={setMinimumMPG}
        />
        <Divider></Divider>
        <br></br>
        <PreferencesForm setDashboardPrefs={setTemporaryPrefs} type={'dashboard'} showSkipButton={false} showDoneButton={false} showLogo={false}/>
        <Divider></Divider>
        <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={handleGenerate} >
          Re-Generate Trip
        </Button> 
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <RouteOptions/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AttractionsList></AttractionsList>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box sx={{ overflowY: 'auto', maxHeight: '450px'}}>
        <TripOverview></TripOverview>
        <br></br>
        <Divider></Divider>
        <br></br>
        {tripDetails && tripDetails.stops ?
        (tripDetails._id ? (
          <>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(false)} >
              Update Trip
            </Button>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(true)} >
              Save as New Trip
            </Button>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => shareTrip(true)} >
              Share Trip
            </Button> 
          </>
          ):(  
            <>
            {/* <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => shareTrip(true)} >
              Share Trip
            </Button>  */}
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(true)} >
              Save Trip
            </Button>         
            </>   
          )):(<></>)
          }
          </Box>
      </TabPanel>
      <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>      
    </Box>
  );
}


