import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, Divider } from '@mui/material';
import { Button, InputLabel, MenuItem, FormControl, Select, Input, Grid, createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import Logo from '../assets/rr-logo.png';


const options = {
    method: 'GET',
    url: 'https://car-data.p.rapidapi.com/cars',
    params: {
      limit: '50',
      page: '0'
    },
    headers: {
      'X-RapidAPI-Key': '8f96b4e240msh2613d084cf46613p164776jsnbfdbabb5ba48',
      'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
    }
};

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

export default function VehicleForm() {
    const [open, setOpen] = React.useState(true);
    const [year, setYear] = React.useState('');
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [color, setColor] = React.useState('');
    const [mpg, setMPG] = React.useState('');
    const [yearList, setYearList] = React.useState([])
    const [makeList, setMakeList] = React.useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [allOptionsList, setAllOptionsList] = React.useState([]);  // HOLDS ALL ORIGINAL DATA FROM API
    const { user, updateUser } = useUserContext();

    const [yearFilledOut, setYearFilledOut] = React.useState(false);
    const [makeFilledOut, setMakeFilledOut] = React.useState(false);
    const [yearStatus, setYearStatus] = React.useState('');
    const [makeStatus, setMakeStatus] = React.useState('');
    const [modelStatus, setModelStatus] = React.useState('');
    const [colorStatus, setColorStatus] = React.useState('');
    
    /* FETCHES DATA FROM CAR DATA API */
    const fetchData = () => {
        axios.request(options)
        .then(response => {
            const data = response.data;
            setAllOptionsList(data);
            //console.log("API Response - All Data:", data);
            let optionArray = [];
            for (let i = 0; i < data.length; i++) {
                if (!optionArray.includes(data[i].year)) {
                    optionArray.push(data[i].year);
                }
            }
            optionArray.sort((a, b) => a - b);
            setYearList(optionArray);
            // console.log('API Response for Year:', optionArray);
            optionArray = [];
            for (let i = 0; i < data.length; i++) {
                if (!optionArray.includes(data[i].make)) {
                    optionArray.push(data[i].make);
                }           
            }
            optionArray.sort((a, b) => a - b);
            setMakeList(optionArray);
            // console.log('API Response for Make:', optionArray);
            optionArray = [];
            for (let i = 0; i < data.length; i++) {
                if (!optionArray.includes(data[i].model)) {
                    optionArray.push(data[i].model);
                }  
            }
            optionArray.sort((a, b) => a - b);
            setModelList(optionArray);
            // console.log('API Response for Model:', optionArray);
        })
        .catch(error => {
            console.error(error);
        });
    };

    const handleSubmit = async (event) => {
        var success = true;
        event.preventDefault();
        if (year.length === 0) {
            setYearStatus("Please select the year of your vehicle.");
        }  else {
            setYearStatus('');
        }
        if (make.length === 0) {
            setMakeStatus("Please select the make of your vehicle.");
        } else {
            setMakeStatus('');
        }
        if (model.length === 0) {
            setModelStatus("Please select the model of your vehicle.");
        } else {
            setModelStatus('');
        }
        if (color.length === 0) {
            setColorStatus("Please enter the color of your vehicle.");
        } else {
            setColorStatus('');
        }
        if (year.length !== 0 && make.length !== 0 && model.length !== 0 && color.length !== 0) {
            await axios.post('/api/user/addVehicle', {
                email: user.email,
                make: make,
                model: model,
                year: year,
                color: color,
                mpgGiven: mpg
            }).then(response => {
                const newUser = response.data;
                updateUser(newUser);
                alert("Your vehicle has been saved!");
            }).catch(error => {
                console.log(error.response.data.error);
                alert("There was an error saving your vehicle: " + error.response.data.error + ".\nPlease try again.");
            });
        }
    }

    const handleSkip = () => {
        setOpen(false);
        setYear('');
        setMake('');
        setModel('');
        setColor('');
        setMPG('');
        setYearStatus('');
        setMakeStatus('');
        setModelStatus('')
        setColorStatus('');
        /* SEND DEFAULT DATA TO DATABASE */
    }
    
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <>
                {/* ADDS BACKGROUND BLUR EFFECT */}
                {open && (
                    <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    />
                )}

                <Dialog open={open} fullWidth maxWidth="sm">
                    <img src={Logo} alt="Logo" width={200} style={{ padding: '10px'}}/>
                    <DialogTitle style={{ padding: '20px', margin: '0', fontSize: '25px' }}>Vehicle Information</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please enter the year, make, and model of the primary vehicle you would like to use for road trips.
                        </DialogContentText>
                        <br></br>
                        <Divider></Divider>
                        <br></br>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="yearLabel">Year</InputLabel>
                            <Select
                                name="year"
                                value={year}
                                required
                                onChange={(event) => {
                                    setYear(event.target.value);
                                    setYearFilledOut(true);
                                    let newOptionsList = [];
                                    for (let i = 0; i < allOptionsList.length; i++) {
                                        if (allOptionsList[i].year === event.target.value && !(newOptionsList.includes(allOptionsList[i].make))) {
                                            newOptionsList.push(allOptionsList[i].make);
                                        }
                                    }
                                    newOptionsList.sort((a, b) => a - b);
                                    setYearStatus('');
                                    setMakeList(newOptionsList);
                                }}
                                >
                                {yearList.map((year, index) => (
                                    <MenuItem key={index} value={year}>
                                        {}
                                    </MenuItem>
                                ))}                
                            </Select>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{yearStatus}</Typography>
                        </FormControl>
                        <br></br>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="makeLabel">Make</InputLabel>
                            <Select
                                name="make"
                                value={make}
                                required
                                disabled={!yearFilledOut}
                                onChange={event => {
                                    setMake(event.target.value);
                                    setMakeFilledOut(true);
                                    let newOptionsList = [];
                                    for (let i = 0; i < allOptionsList.length; i++) {
                                        if (allOptionsList[i].year === year && allOptionsList[i].make === event.target.value && !(newOptionsList.includes(allOptionsList[i].model))) {
                                            newOptionsList.push(allOptionsList[i].model);
                                        }
                                    }
                                    setMakeStatus('');
                                    setModelList(newOptionsList);
                                }}
                                >
                                {makeList.map((make, index) => (
                                    <MenuItem key={index} value={make}>
                                        {make}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{makeStatus}</Typography>
                        </FormControl>  
                        <br></br>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="modelLabel">Model</InputLabel>
                            <Select
                                name="model"
                                value={model}
                                disabled={!makeFilledOut}
                                required
                                onChange={event =>  {
                                    setModelStatus('');
                                    setModel(event.target.value);
                                }}
                                >
                                {modelList.map((model, index) => (
                                    <MenuItem key={index} value={model}>
                                        {model}
                                    </MenuItem>
                                ))}                       
                            </Select>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{modelStatus}</Typography>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="colorLabel">Color</InputLabel>
                            <Input
                                name="color"
                                value={color} 
                                required
                                onChange={event =>  {
                                    if (event.target.value.length !== 0) {
                                        setColorStatus('');
                                    }
                                    setColor(event.target.value);
                                }}
                                >                   
                            </Input>
                            <Typography color="error.main" justifyContent="flex-end" component="h1" variant="body2">{colorStatus}</Typography>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                            <InputLabel id="mpgLabel">Miles Per Gallon</InputLabel>
                            <Input
                                name="mpg"
                                value={mpg}                  
                                onChange={event =>  {
                                    setMPG(event.target.value);
                                }}
                                >                   
                            </Input>
                        </FormControl>
                    </DialogContent>
                    <DialogActions sx={{ padding: '16px', justifyContent: 'space-between' }}>
                        <Grid container justifyContent="flex-start">
                            <Button onClick={handleSkip} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'red', color: 'white'}}>
                                Skip
                            </Button>
                        </Grid>
                        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'red', color: 'white' }}>
                            Done
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        </ThemeProvider>
    );
}
