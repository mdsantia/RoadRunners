import * as React from 'react';
import { Container } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary, MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { useDashboardContext } from '../../context/DashboardContext';
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


function ShareTrip() {
    const [shareToEmails, setShareToEmails] = React.useState([]);
    const [emailToAdd, setEmailToAdd] = React.useState("");
    const [addButtonClicked, setAddButtonClicked] = React.useState(false);

    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }
    
    React.useEffect(() => {
        if (emailToAdd) {
            setShareToEmails(prevEmails => [...prevEmails, emailToAdd]);
            setEmailToAdd("");
            setAddButtonClicked(false);
        }
    }, [addButtonClicked]);


    return (
        <div style={{textAlign: 'left'}}>
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
