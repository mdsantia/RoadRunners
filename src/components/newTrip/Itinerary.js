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
import { Button, Divider, Container, Dialog, DialogContent, TextField, Grid } from '@mui/material';
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
import LZString from 'lz-string';
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

  /* Sharing Trips */
  const [shareTripDialog, setShareTripDialog] = React.useState(false);
  const [shareToEmails, setShareToEmails] = React.useState([]);
  const handleShareTripDialog = (bool) => {
    setShareTripDialog(bool);
  }

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
    const tripDetailsToHash = {
        startLocation: tripDetails.startLocation,
        endLocation: tripDetails.endLocation,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        preferences: tripDetails.preferences,
        numVehicles: tripDetails.numVehicles,
        selectedVehicles: tripDetails.selectedVehicles,
        minimumMPG: tripDetails.minimumMPG,
    }
    if (tripDetails.id) {
      tripDetailsToHash.id = tripDetails.id;
    }
    await axios.post('/api/user/saveTrip', {
      email: user.email,
      hash: btoa(JSON.stringify({tripDetails: tripDetailsToHash})),
      id: isNewTrip ? null : (tripDetails.id ? tripDetails.id : null),
      allStops: tripDetails.allStops,
      options: tripDetails.options,
      polyline: tripDetails.polyline,
      chosenRoute: tripDetails.chosenRoute,
      stops: tripDetails.stops, 
    }).then((response) => {
       const newUser = response.data;
       updateUser(newUser);
       isNewTrip ? showMessage('Trip saved successfully!', 2000, 'success') : showMessage('Trip updated successfully!', 2000, 'success');
       if(isNewTrip) {
        const encodedTripDetails = newUser.trips[newUser.trips.length - 1].hash;
        navigate(`/dashboard/${encodedTripDetails}`);
       }
    }
    ).catch((error) => {
      console.log(error);
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
        {(tripDetails && tripDetails.id) ?  (
          <>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(false)} >
              Update Trip
            </Button>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(true)} >
              Save as New Trip
            </Button>
            {/* <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(true)} >
              Share Trip
            </Button>  */}
          </>
          ):(  
            <>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => handleShareTripDialog(true)}>
              Share Trip
            </Button>
            <Button variant="contained" sx={{m:2, backgroundColor: 'darkblue'}} onClick={() => saveTrip(true)} >
              Save Trip
            </Button>         
            </>   
          )}  
          </Box>
      </TabPanel>
      {shareTripDialog && (
        <Dialog open={shareTripDialog} onClose={() => handleShareTripDialog(false)}>
          <DialogContent>
            <div style={{textAlign: 'left'}}>
              <Typography style={{ fontSize: '25px' }}>Share Trip from "{tripDetails.startLocation}" to "{tripDetails.endLocation}"</Typography>
              <br></br>
              <Container>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={10} sm={10} md={10}>
                    <TextField
                      id="shareToEmails"
                      variant="outlined"
                      placeholder="Add people"
                      // value={shareTo}
                      fullWidth
                      inputProps={{ style: { height: '3%' } }}
                      onChange={(event) => {
                          // setShareToEmails([]);
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} alignItems="center">
                      <Button
                        sx={{ 
                          borderRadius: '10px',
                          border: '1px solid #ccc',
                          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                          backgroundColor: 'darkblue',
                          color: 'white',
                          marginTop: '22px',
                          '&:hover': {
                              backgroundColor: '#6495ed',
                          },
                        }}
                      >
                        Add
                      </Button>
                  </Grid>
                </Grid>
                <br></br>
                People with Access:
                <br></br>
                {shareToEmails.map((email, index) => (
                  <Typography>{email}</Typography>
                ))}
              </Container>
            </div>
          </DialogContent>
        </Dialog>     
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar> 
    </Box>
  );
}