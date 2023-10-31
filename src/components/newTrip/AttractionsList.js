import * as React from 'react';
import { useState } from 'react';
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
import HotelCard from '../StopsComponents/Hotels';
import Landmarks from '../StopsComponents/Landmarks';
import Attractions from '../StopsComponents/Attractions';


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

  //Hotel Dummy Data
  const HotelData = [
    {
      name: 'Holiday Inn Vancouver',
      location: 'Vancouver,British Columbia',
      price: '200',
      rating: '2.0',
      reviews: '500'
    },
    {
      name: 'Fairmont Hotel Vancouver',
      location: 'Vancouver,British Columbia',
      price: '400',
      rating: '3.0',
      reviews: '1000'
    },
    {
      name: 'Shangri-La False Creek',
      location: 'Vancouver,British Columbia',
      price: '600',
      rating: '4.0',
      reviews: '400'
    },
    {
      name: 'The Met Coal Harbor',
      location: 'Vancouver,British Columbia',
      price: '600',
      rating: '4.0',
      reviews: '600'
    }
  ];

  //LandMark Dummy Data
  const LandmarkData = [
    {
      name: 'Niagara Falls',
      price: '10.00',
      rating: '4.00',
      reviews:'400',
    },
    {
      name: 'Six Flags Canada',
      price: '50.00',
      rating: '4.00',
      reviews: '500',
    },
    {
      name: 'Lake Ontario',
      price: '5.00',
      rating: '4.00',
      reviews: '200',
    },
   
  ];


    //Attraction Dummy Data
    const AttractionData = [
      {
        name: 'Mall Of America',
        category: 'Shopping',
        price: '0',
        rating: '4.00',
        reviews:'400',
      },
      {
        name: 'Science Centre',
        category: 'Family',
        price: '5.00',
        rating: '4.00',
        reviews: '500',
      },
      {
        name: 'National Art Gallery',
        category: 'Museum',
        price: '25.00',
        rating: '4.00',
        reviews: '200',
      },
     
    ];


  return (
    <Box
      sx={{ flexGrow: 2, bgcolor: 'background.paper', display: 'flex', height: '100%', alignContent: 'center', alignItems: 'start', padding: '0', width:'100%' }}
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
        <Tab icon={<RestaurantIcon />} iconPosition="start" label="Restaurants" {...a11yProps(3)} />
        <Tab icon={<TheaterComedyIcon />} iconPosition="start" label="Live Events" {...a11yProps(4)} />
        <Tab icon={<LocalGasStationIcon />} iconPosition="start" label="Gas Stations" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {HotelData.map((hotel, index) => (
          <HotelCard 
          key={index}
          data={hotel} 
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={1} style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {LandmarkData.map((landmark, index) => (
          <Landmarks 
          key={index}
          data={landmark} 
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={2}style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {AttractionData.map((attraction, index) => (
          <Attractions
          key={index}
          data={attraction} 
          />
        ))}
      </TabPanel>
      <TabPanel value={value} index={3} style={{ maxHeight: '400px', overflowY: 'auto' }}>
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