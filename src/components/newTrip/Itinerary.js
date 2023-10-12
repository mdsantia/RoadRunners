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
import { Button } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import axios from 'axios';
import PreferencesForm from '../userProfile/PreferencesForm';
import { useNavigate } from 'react-router-dom';
import VehicleSelectionForm from '../newTrip/VehicleSelectionForm';
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
      style={{
        overflowY: 'auto', // Add vertical scrollbar when content overflows
        maxHeight: '400px', // Set a maximum height to control the scrollbar
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

export default function Itinerary(props) {

  const {user, updateUser} = useUserContext();
  const navigate = useNavigate();
 
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [vehicleList, setVehicleList] = React.useState([]);
  const [selectedVehicles, setSelectedVehicles] = React.useState([]);
  const [numVehicles, setNumVehicles] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      setVehicleList(user.vehicles);
    }
  }, [user]);

  const numOptionsPerColumn = 10;
  const findTotalColumns = (optionsList) => {
    return Math.ceil(optionsList.length / numOptionsPerColumn);
  }

  const saveTrip = async () => {
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

  const handleGenerate = () => {
    navigate(`/dashboard/${props.startLocation}/${props.endLocation}/${props.startDate}/${props.endDate}`);
    window.location.reload();
  }

  const formatVehicleList = (vehicleList) => {
    return vehicleList.map((vehicle) => {return {name: `${vehicle.color} ${vehicle.year} ${vehicle.make} ${vehicle.model}`, mpg: vehicle.mpg}});
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
        <VehicleSelectionForm
          vehicleList={formatVehicleList(vehicleList)}
          numVehicles={numVehicles}
          selectedVehicles={selectedVehicles}
          setNumVehicles={setNumVehicles}
          setSelectedVehicles={setSelectedVehicles}
        />
        <PreferencesForm type={'dashboard'} showSkipButton={false} showDoneButton={false} showLogo={false}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
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


