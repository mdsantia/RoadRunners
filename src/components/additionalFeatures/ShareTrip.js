import * as React from 'react';
import { Container } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';



function ShareTrip() {
    const [shareToEmails, setShareToEmails] = React.useState([]);
    const [emailToAdd, setEmailToAdd] = React.useState("");
    const [addButtonClicked, setAddButtonClicked] = React.useState(false);
    const [permissionToAdd, setpermissionToAdd] = React.useState("");

    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }

    const handlePermission = (event) => {
        setpermissionToAdd(event.target.value);
    };

    React.useEffect(() => {
        if (emailToAdd) {
            setShareToEmails(prevEmails => [...prevEmails, emailToAdd]);
            setEmailToAdd("");
            setAddButtonClicked(false);
        }
    }, [addButtonClicked]);


    return (
        <div style={{ textAlign: 'left' }}>
            <Typography style={{ fontSize: '25px' }}>Share Trip</Typography>
            <br></br>
            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10} sm={10} md={10} alignItems="center">
                        <TextField
                            id="shareToEmails"
                            variant="outlined"
                            placeholder="Add people"
                            value={emailToAdd}
                            fullWidth
                            inputProps={{ style: { height: '3%' } }}
                            onChange={(event) => {
                                setEmailToAdd(event.target.value);
                            }}
                        />
                    </Grid>

                </Grid>
                <br></br>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5} sm={5} md={5} alignItems="center">
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Permission</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={permissionToAdd}
                                label="Permission"
                                onChange={handlePermission}
                            >
                                <MenuItem value={10}>Viewer</MenuItem>
                                <MenuItem value={20}>Editor</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2} alignItems="center">

                        <Button
                            sx={{
                                borderRadius: '10px',
                                border: '1px solid #ccc',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                backgroundColor: 'darkblue',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#6495ed',
                                },
                            }}
                            onClick={handleAddButtonClick}
                        >
                            Add
                        </Button>



                    </Grid>





                </Grid>

                <Typography sx={{ fontWeight: 'bold', marginTop: '3%', marginBottom: '3%' }}>People with Access:</Typography>
                {shareToEmails.map((email, index) => (
                    <Typography>{email}</Typography>
                ))}
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3%' }}>
                <Button
                    sx={{
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'darkblue',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6495ed',
                        },
                        fontSize: '12px',
                        padding: '8px 10px',
                    }}
                >
                    Copy Link
                </Button>
                <Button
                    sx={{
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        backgroundColor: 'darkblue',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#6495ed',
                        },
                        fontSize: '12px',
                        padding: '8px 10px',
                    }}>
                    Share
                </Button>
            </Container>
        </div>
    )
}

export default ShareTrip;
