import React from 'react';
import { useState } from 'react';
import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RouteIcon from '@mui/icons-material/Route';
import AttractionsIcon from '@mui/icons-material/Attractions';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

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

export default function Itinerary() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%', paddingTop:'15%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
            <Tab icon={<FavoriteIcon />}  label="Preferences" {...a11yProps(0)} />
            <Tab icon={<RouteIcon />}  label="Routes" {...a11yProps(1)} />
            <Tab icon={<AttractionsIcon />} label="Attractions" {...a11yProps(2)} />
            <Tab icon={<FormatListNumberedIcon />}label="Overview" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
        <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
     
      </RadioGroup>
    </FormControl>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Route options
        </TabPanel>
        <TabPanel value={value} index={2}>
          Attraction list
        </TabPanel>
        <TabPanel value={value} index={3}>
          Overview
        </TabPanel>
      </Box>
    );
  }


