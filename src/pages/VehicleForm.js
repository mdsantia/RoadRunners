import * as React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Button, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import axios from 'axios';


const options = {
  method: 'GET',
  url: 'https://car-data.p.rapidapi.com/cars',
  params: {
    limit: '10',
    page: '0'
  },
  headers: {
    'X-RapidAPI-Key': '8f96b4e240msh2613d084cf46613p164776jsnbfdbabb5ba48',
    'X-RapidAPI-Host': 'car-data.p.rapidapi.com'
  }
};

export default function VehicleForm() {
    const [open, setOpen] = React.useState(true);
    const [year, setYear] = React.useState('');
    const [make, setMake] = React.useState('');
    const [model, setModel] = React.useState('');
    const [yearList, setYearList] = React.useState([])
    const [makeList, setMakeList] = React.useState([]);
    const [modelList, setModelList] = React.useState([]);
    const [allOptionList, setAllOptionList] = React.useState([]);

    /* FETCHES DATA FROM CAR DATA API */
    const fetchData = () => {
        axios.request(options)
        .then(response => {
            const data = response.data;
            setAllOptionList(data);
            let optionArray = [];
            for (let i = 0; i < data.length; i++) {
                optionArray.push(data[i].year);
            }
            setYearList(optionArray);
            console.log('API Response for Year:', optionArray);
            optionArray = [];
            for (let i = 0; i < data.length; i++) {
                optionArray.push(data[i].make);
            }
            setMakeList(optionArray);
            console.log('API Response for Make:', optionArray);
            optionArray = [];
            for (let i = 0; i < data.length; i++) {
                optionArray.push(data[i].model);
            }
            setModelList(optionArray);
            console.log('API Response for Model:', optionArray);
        })
        .catch(error => {
            console.error(error);
        });
    };
    
    React.useEffect(() => {
        fetchData();
        console.log("fetching year\n");
        console.log(yearList);
        console.log("fetching make\n");
        console.log(makeList);
        console.log("fetching model\n");
        console.log(modelList);
    }, []);
    
    return (
        <Dialog open={open}>
            <DialogTitle>Vehicle Information</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the year, make, and model of the primary vehicle you would like to use for road trips.
                </DialogContentText>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                    <InputLabel id="yearLabel">Year</InputLabel>
                    <Select
                        name="year"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        >
                        {yearList.map((year, index) => (
                            <MenuItem key={index} value={year}>
                                {year}
                            </MenuItem>
                        ))}                
                    </Select>
                </FormControl>
                <br></br>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                    <InputLabel id="makeLabel">Make</InputLabel>
                    <Select
                        name="make"
                        value={make}
                        onChange={event => setMake(event.target.value)}
                        >
                        {makeList.map((make, index) => (
                            <MenuItem key={index} value={make}>
                                {make}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>  
                <br></br>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 500 }}>
                    <InputLabel id="modelLabel">Model</InputLabel>
                    <Select
                        name="model"
                        value={model}
                        onChange={event => setModel(event.target.value)}
                        >
                        {modelList.map((model, index) => (
                            <MenuItem key={index} value={model}>
                                {model}
                            </MenuItem>
                        ))}                       
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}
