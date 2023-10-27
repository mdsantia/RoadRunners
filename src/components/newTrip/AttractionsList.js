import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HotelIcon from '@mui/icons-material/Hotel';
import LandscapeIcon from '@mui/icons-material/Landscape';
import MuseumIcon from '@mui/icons-material/Museum';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function AttractionsList() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%',alignContent:'center', alignItems:'start' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab icon={<HotelIcon />} iconPosition="start" label="Hotels" {...a11yProps(0)} />
        <Tab icon={<LandscapeIcon />} iconPosition="start" label="Landmarks" {...a11yProps(1)} />
        <Tab icon={<MuseumIcon />} iconPosition="start" label="Attractions" {...a11yProps(2)} />
        <Tab icon={<RestaurantIcon />} iconPosition="start"  label="Restaurants" {...a11yProps(3)} />
        <Tab icon={<TheaterComedyIcon />} iconPosition="start" label="Live Events" {...a11yProps(4)} />
        <Tab icon={<LocalGasStationIcon />} iconPosition="start" label="Gas Stations" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Hotels
      </TabPanel>
      <TabPanel value={value} index={1}>
        Landmarks
      </TabPanel>
      <TabPanel value={value} index={2}>
        Attractions
      </TabPanel>
      <TabPanel value={value} index={3}>
        Restaurants
      </TabPanel>
      <TabPanel value={value} index={4}>
        Live Events
      </TabPanel>
      <TabPanel value={value} index={5}>
       Gas Stations
      </TabPanel>
    
    </Box>
  );
}