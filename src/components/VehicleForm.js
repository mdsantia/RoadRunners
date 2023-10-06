import * as React from 'react';
import { Button, InputLabel, MenuItem, FormControl, Typography, Divider } from '@mui/material';
import { Select, Input, createTheme, ThemeProvider } from '@mui/material';
import { Container } from '@mui/material';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import Logo from '../assets/rr-logo.png';

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

export default function VehicleForm(props) {
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
    const [yearStatus, setYearStatus] = React.useState(null);
    const [makeStatus, setMakeStatus] = React.useState(null);
    const [modelStatus, setModelStatus] = React.useState(null);
    const [colorStatus, setColorStatus] = React.useState('');
    
    /* FETCHES DATA FROM CAR DATA API */
    const fetchData = () => {
        axios
        .get('/api/vehiclesData/getACar', { params: {year: year, make: make, model: model} })
        .then((res) => {
          //console.log(res.data);
          // setDirections(res.data); // Set the directionsResponse in the context
          if (!year) {
            setYearList(res.data.sort((a, b) => a - b));
          }
          if (!make) {
            setMakeList(res.data.sort((a, b) => a - b));
          }
          if (!model) {
            setModelList(res.data.sort((a, b) => a - b));
          }
        })
        .catch((err) => {
          console.log(err);
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
            props.onClose();
        }
    }

    const handleSkip = () => {
        setYear('');
        setMake('');
        setModel('');
        setColor('');
        setMPG('');
        setYearStatus('');
        setMakeStatus('');
        setModelStatus('')
        setColorStatus('');
        props.onClose();
    }
    
    React.useEffect(() => {
        fetchData();
    }, [make, year, model]);

    return (
        <ThemeProvider theme={theme}>
            <img src={Logo} alt="Logo" width={200} style={{ padding: '10px'}}/>
            <div style={{ marginLeft: '10px' }}>
                <Typography style={{ padding: '20px', margin: '0', fontSize: '25px', fontWeight: 'bold'}}>Vehicle Information</Typography>
                <Container>
                    <Typography variant="body1">
                        Please enter the year, make, and model of the primary vehicle you would like to use for road trips.
                    </Typography>
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
                                setMake(null);
                                setModel(null);
                                setYearStatus('');
                                setMakeStatus("Please select the make of your vehicle.");
                                setModelStatus("Please select the model of your vehicle.");
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
                                setMakeStatus('');
                                setModelStatus("Please select the model of your vehicle.");
                                setModel(null);
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
                                } else {
                                    setColorStatus("Please enter the color of your vehicle.");
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
                </Container>
                <Container style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    <Button onClick={handleSkip} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'red', color: 'white'}}>
                        Skip
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ width: '120px', backgroundColor: 'red', color: 'white' }}>
                        Done
                    </Button>
                </Container>
            </div>
        </ThemeProvider>
    );
}
