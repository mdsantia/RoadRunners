import * as React from 'react';
import { Typography, FormControlLabel, Checkbox, Container } from '@mui/material';
import { Button, Grid, Divider, createTheme, ThemeProvider } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import SickOutlinedIcon from '@mui/icons-material/SickOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
import FastfoodOutlinedIcon from '@mui/icons-material/FastfoodOutlined';
import MapsHomeWorkOutlinedIcon from '@mui/icons-material/MapsHomeWorkOutlined';
import PoolOutlinedIcon from '@mui/icons-material/PoolOutlined';
import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import ForestOutlinedIcon from '@mui/icons-material/ForestOutlined';
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined';
import HikingOutlinedIcon from '@mui/icons-material/HikingOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalDiningOutlinedIcon from '@mui/icons-material/LocalDiningOutlined';
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined';
import FamilyRestroomOutlinedIcon from '@mui/icons-material/FamilyRestroomOutlined';
import LunchDiningOutlinedIcon from '@mui/icons-material/LunchDiningOutlined';
import BrunchDiningOutlinedIcon from '@mui/icons-material/BrunchDiningOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import EmojiFoodBeverageOutlinedIcon from '@mui/icons-material/EmojiFoodBeverageOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import DiningOutlinedIcon from '@mui/icons-material/DiningOutlined';
import FlatwareOutlinedIcon from '@mui/icons-material/FlatwareOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
import CabinOutlinedIcon from '@mui/icons-material/CabinOutlined';
import HolidayVillageOutlinedIcon from '@mui/icons-material/HolidayVillageOutlined';
import GiteOutlinedIcon from '@mui/icons-material/GiteOutlined';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import DeckOutlinedIcon from '@mui/icons-material/DeckOutlined';
import HotelOutlinedIcon from '@mui/icons-material/HotelOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import NightShelterOutlinedIcon from '@mui/icons-material/NightShelterOutlined';


const theme = createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
});

export default function PreferencesInfo(props) {
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

    const attractionIcons = {
        'Entertainment': <TheaterComedyOutlinedIcon></TheaterComedyOutlinedIcon>,
        'Outdoor/Nature': <ForestOutlinedIcon></ForestOutlinedIcon>,
        'Cultural': <FlagCircleOutlinedIcon></FlagCircleOutlinedIcon>,
        'Adventure': <HikingOutlinedIcon></HikingOutlinedIcon>,
        'Water': <PoolOutlinedIcon></PoolOutlinedIcon>,
        'Educational': <SchoolOutlinedIcon></SchoolOutlinedIcon>,
        'Shopping': <ShoppingBagOutlinedIcon></ShoppingBagOutlinedIcon>,
        'Culinary': <LocalDiningOutlinedIcon></LocalDiningOutlinedIcon>,
        'Religious': <ChurchOutlinedIcon></ChurchOutlinedIcon>,
        'Family-Friendly': <FamilyRestroomOutlinedIcon></FamilyRestroomOutlinedIcon>
    };
    const diningIcons = {
        'Fast Food': <LunchDiningOutlinedIcon></LunchDiningOutlinedIcon>,
        'Fine Dining': <BrunchDiningOutlinedIcon></BrunchDiningOutlinedIcon>,
        'Casual Dining': <RestaurantOutlinedIcon></RestaurantOutlinedIcon>,
        'Cafés/Coffee Shops': <EmojiFoodBeverageOutlinedIcon></EmojiFoodBeverageOutlinedIcon>,
        'Buffets': <FlatwareOutlinedIcon></FlatwareOutlinedIcon>,
        'Food Trucks': <LocalShippingOutlinedIcon></LocalShippingOutlinedIcon>,
        'Family Restaurants': <FamilyRestroomOutlinedIcon></FamilyRestroomOutlinedIcon>,
        'Vegetarian/Vegan': <SpaOutlinedIcon></SpaOutlinedIcon>,
        'Ethnic/International': <FlagCircleOutlinedIcon></FlagCircleOutlinedIcon>,
        'Diners': <DiningOutlinedIcon></DiningOutlinedIcon>
    };
    const housingIcons = {
        'Hotels': <RoomServiceOutlinedIcon></RoomServiceOutlinedIcon>,
        'Motels': <HotelOutlinedIcon></HotelOutlinedIcon>,
        'Hostels': <NightShelterOutlinedIcon></NightShelterOutlinedIcon>,
        'Airbnb': <HouseOutlinedIcon></HouseOutlinedIcon>,
        'Vacation Rentals': <HolidayVillageOutlinedIcon></HolidayVillageOutlinedIcon>,
        'Resorts': <DeckOutlinedIcon></DeckOutlinedIcon>,
        'Roadside Inns & Lodges': <GiteOutlinedIcon></GiteOutlinedIcon>,
        'Cabins': <CabinOutlinedIcon></CabinOutlinedIcon>,
        'Cottages:': <CottageOutlinedIcon></CottageOutlinedIcon>
    };

    const [budget, setBudget] = React.useState('');
    const [commuteTime, setCommuteTime] = React.useState('');
    const [carsickRating, setCarsickRating] = React.useState('');
    const [attractionSelection, setAttractionSelection] = React.useState([]);
    const [diningSelection, setDiningSelection] = React.useState([]);
    const [housingSelection, setHousingSelection] = React.useState([]);
    
    const numOptionsPerColumn = 3;
    const findTotalColumns = (optionsList) => {
        return Math.ceil(optionsList.length / numOptionsPerColumn);
    }

    const handleEdit = async (event) => {
        event.preventDefault();

    }

    const handleSave = async (event) => {
        event.preventDefault();

    }
    
    const handleCancel = async (event) => {
        event.preventDefault();

    }

    return (
        <ThemeProvider theme={theme}>
            <div style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: '25px', fontWeight: 'bold' }}>Your Trip Preferences</Typography>
                <br></br>
                <Container>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                            <PaidOutlinedIcon></PaidOutlinedIcon>
                            <Typography
                                variant="body1"
                                fontWeight="bold"
                                style={{ paddingLeft:'10px' }}
                            >
                                Preferred Budget for Road Trips
                            </Typography>
                        </div>                                    
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {budget ? budget : 'N/A'}
                        </Grid>
                    </Grid>                               
                    <br></br>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                            <AccessTimeOutlinedIcon></AccessTimeOutlinedIcon>
                            <Typography
                                variant="body1"
                                fontWeight="bold"
                                style={{ paddingLeft: '10px' }}
                            >
                                Preferred Maximum Commute Time Between Stops
                            </Typography>
                        </div>                                    
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {commuteTime ? commuteTime : 'N/A'}
                        </Grid>
                    </Grid> 
                    <br></br>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
                                <SickOutlinedIcon></SickOutlinedIcon>
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    style={{ paddingLeft: '10px' }}
                                >
                                    Susceptibility to Motion Sickness
                                </Typography> 
                            </div> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {carsickRating ? carsickRating : 'N/A'}
                        </Grid>     
                    </Grid>
                    <br></br>
                    <Divider></Divider>
                    <br></br>
                    <Typography variant="body1" fontWeight="bold">
                        <AttractionsOutlinedIcon style={{ marginRight: '10px' }} />
                        Preferred Attraction Types
                    </Typography>
                    <br></br>
                    <div style={{ paddingLeft: '50px' }}>
                        <Grid container>
                            {Array.from({ length: findTotalColumns(attractionSelection) }).map((_, columnIndex) => (
                                <Grid item xs={3} key={columnIndex}>
                                    {attractionSelection.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((attraction, index) => (
                                        <Typography key={index}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {attractionIcons[attraction] && (
                                                <div style={{ marginRight: '15px' }}>
                                                    {attractionIcons[attraction]}
                                                </div>
                                                )}
                                                {attraction}
                                            </div>
                                        </Typography>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                    <br></br>
                    <Divider></Divider>
                    <br></br>
                    <Typography variant="body1" fontWeight="bold">
                        <FastfoodOutlinedIcon style={{ marginRight: '10px' }}></FastfoodOutlinedIcon>
                        Dining Preferences
                    </Typography>
                    <br></br>
                    <div style={{ paddingLeft: '50px' }}>
                        <Grid container>
                            {Array.from({ length: findTotalColumns(diningSelection) }).map((_, columnIndex) => (
                                <Grid item xs={3} key={columnIndex}>
                                    {diningSelection.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((diningPlace, index) => (
                                        <Typography key={index}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {diningIcons[diningPlace] && (
                                                <div style={{ marginRight: '15px' }}>
                                                    {diningIcons[diningPlace]}
                                                </div>
                                                )}
                                                {diningPlace}
                                            </div>
                                        </Typography>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                    <br></br>
                    <Divider></Divider>
                    <br></br>
                    <Typography variant="body1" fontWeight="bold">
                        <MapsHomeWorkOutlinedIcon style={{ marginRight: '10px' }}></MapsHomeWorkOutlinedIcon>
                        Housing Preferences
                    </Typography>
                    <br></br>
                    <div style={{ paddingLeft: '50px' }}>
                        <Grid container>
                            {Array.from({ length: findTotalColumns(housingSelection) }).map((_, columnIndex) => (
                                <Grid item xs={3} key={columnIndex}>
                                    {housingSelection.slice(columnIndex * numOptionsPerColumn, (columnIndex + 1) * numOptionsPerColumn).map((housingChoice, index) => (
                                        <Typography key={index}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {housingIcons[housingChoice] && (
                                                <div style={{ marginRight: '15px' }}>
                                                    {housingIcons[housingChoice]}
                                                </div>
                                                )}
                                                {housingChoice}
                                            </div>
                                        </Typography>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </Container>
                <Container style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    {props.showEditButton && (
                        <Button onClick={handleEdit} variant="contained" sx={{ width: '180px', backgroundColor: 'darkblue', color: 'white' }}>
                            Edit Preferences
                        </Button>
                    )}
                    {props.showSaveButton && (
                        <Button onClick={handleSave} variant="contained" sx={{ width: '180px', backgroundColor: 'darkblue', color: 'white' }}>
                            Save Preferences
                        </Button>
                    )}
                    {props.showCancelButton && (
                        <Button onClick={handleCancel} variant="contained" sx={{ width: '180px', backgroundColor: 'darkblue', color: 'white' }}>
                            Cancel
                        </Button>
                    )}
                </Container>
            </div>
        </ThemeProvider>
    );
}