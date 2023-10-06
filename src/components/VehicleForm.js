import * as React from 'react';
import { Button, InputLabel, MenuItem, FormControl, Typography, Divider } from '@mui/material';
import { Select, Input, createTheme, ThemeProvider } from '@mui/material';
import { Container } from '@mui/material';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import Logo from '../assets/rr-logo.png';
import AddIcon from '@mui/icons-material/Add';

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
    React.useEffect(() => {
        if (props.selectedCar) {
            setYear(props.selectedCar.year);
            setYearFilledOut(true);
            fetchData(props.selectedCar.year, '', '');
            setMake(props.selectedCar.make);
            setMakeFilledOut(true);
            fetchData(props.selectedCar.year, props.selectedCar.make, '');
            setModel(props.selectedCar.model);
            fetchData(props.selectedCar.year, props.selectedCar.make, props.selectedCar.model);
            setColor(props.selectedCar.color);
            setMPG(props.selectedCar.mpg);
        }  
    }, [props.selectedCar]);
    
    const [year, setYear] = React.useState('');
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [color, setColor] = React.useState('');
    const [mpg, setMPG] = React.useState('');
    const [yearList, setYearList] = React.useState([])
    const [makeList, setMakeList] = React.useState([]);
    const [modelList, setModelList] = React.useState([]);
    
    const [yearFilledOut, setYearFilledOut] = React.useState(false);
    const [makeFilledOut, setMakeFilledOut] = React.useState(false);
    const [yearStatus, setYearStatus] = React.useState('');
    const [makeStatus, setMakeStatus] = React.useState('');
    const [modelStatus, setModelStatus] = React.useState('');
    const [colorStatus, setColorStatus] = React.useState('');
    const { user, updateUser } = useUserContext();
    
    /* FETCHES DATA FROM CAR DATA API */
    const fetchData = async (year, make, model) => {
        if (!year) {
            await axios
            .get('/api/vehiclesData/getYears', { params: {year: year} })
            .then((res) => {
                setYearList(res.data.sort((a, b) => a - b));
            })
            .catch((err) => {
            console.log(err);
            });
        }
        if (year && !make) {
            await axios
            .get('/api/vehiclesData/getMakes', { params: {year: year} })
            .then((res) => {
                setMakeList(res.data.sort());
            })
            .catch((err) => {
              console.log(err);
            });
        }
        if (year && make) {
            await axios
            .get('/api/vehiclesData/getModels', { params: {year: year, make: make} })
            .then((res) => {
                setModelList(res.data.sort());
            })
            .catch((err) => {
              console.log(err);
            });
        }
    };

    const handleSubmit = async (event) => {
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
                if (response.status === 201) {
                    alert("Your vehicle has been saved, but we could not find the MPG for your vehicle.\nPlease enter it manually.");
                } else {
                    alert("Your vehicle has been saved!");
                }
                handleCancel();
            }).catch(error => {
                console.log(error.response.data.error);
                alert("There was an error saving your vehicle: " + error.response.data.error + ".\nPlease try again.");
            });
        }
    }

    const handleSave = () => {
        const params = { 
            email: user.email,
            _id: props.selectedCar._id,
            year: year,
            make: make,
            model: model,
            color: color,
            mpgGiven: mpg
        };
        axios.post('/api/user/editVehicle', params)
        .then((res) => {
            updateUser(res.data);
            handleCancel();
        })
        .catch((err) => {
            console.log(err);
        }); 
    }

    const handleCancel = () => {
        setYear('');
        setMake('');
        setModel('');
        setColor('');
        setMPG('');
        setYearStatus('');
        setMakeStatus('');
        setModelStatus('');
        setColorStatus('');
        setYearFilledOut(false);
        setMakeFilledOut(false);
        props.onSelectCar(null);
    };
    
    React.useEffect(() => {
        fetchData(year, make, model);
    }, [year, make, model]);
    return (
        <ThemeProvider theme={theme}>
            {props.showLogo && (
                <img src={Logo} alt="Logo" width={200} style={{ padding: '10px'}}/>
            )}            
            <div style={{ marginLeft: '10px', textAlign: 'left' }}>
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
                                setMake('');
                                setModel('');
                                setYearStatus('');
                                setMakeFilledOut(false);
                                setMakeStatus("Please select the make of your vehicle.");
                                setModelStatus("Please select the model of your vehicle.");
                            }}
                            >
                            {yearList.map((year, index) => (
                                <MenuItem key={index} value={year}>
                                    {year}
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
                                setModel('');
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
                        <InputLabel id="mpgLabel">Miles Per Gallon (Not Required)</InputLabel>
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
                <br></br>
                <Container style={{ display: 'flex', justifyContent: 'space-between', padding: '20px'}}>
                    {!props.selectedCar ? (
                        <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: 'darkblue', color: 'white' }}>
                            Add Vehicle                    
                        </Button>
                    ):''}
                    {props.selectedCar ? (
                        <Button onClick={handleSave} variant="contained" style={{ width: '100px' }} sx={{ backgroundColor: 'darkblue', color: 'white' }}>
                            Save
                        </Button>
                    ):''}
                    {props.selectedCar ? (
                        <Button onClick={handleCancel} variant="contained" style={{ width: '100px' }} sx={{ backgroundColor: 'darkblue', color: 'white' }}>
                            Cancel
                        </Button>
                    ):''}
                </Container>
            </div>
        </ThemeProvider>
    );
}
