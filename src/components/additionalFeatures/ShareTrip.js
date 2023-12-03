import * as React from 'react';
import { Container, Avatar } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { MenuItem, Button, Autocomplete } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';


function ShareTrip ({handleShareTripDialog}) {
    const [userList, setUserList] = React.useState([]);
    const [userToAdd, setUserToAdd] = React.useState({});
    const [addedUsers, setAddedUsers] = React.useState([]);
    const [usersWithAccess, setUsersWithAccess] = React.useState([]);
    const [addButtonClicked, setAddButtonClicked] = React.useState(false);
    const [permissionToAdd, setpermissionToAdd] = React.useState("");
    const [showAddButton, setShowAddButton] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/api/user/getAllUsers`) 
            .then((res) => {
               setUserList(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        }
        fetchData();
    }, []);

    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }

    const handlePermission = (event) => {
        setpermissionToAdd(event.target.value);
    };
    
    const handleShareButton = () => {
        setUsersWithAccess(prevUsers => [...prevUsers, ...addedUsers]);
        setAddedUsers([]);
        setUserToAdd({});
    }

    const handleCancelButton = () => {
        setAddedUsers([]);
        setUserToAdd({});
        handleShareTripDialog();
    }

    React.useEffect(() => {
        if (userToAdd.email) {
            setAddedUsers(prevUsers => [...prevUsers, userToAdd]);
            setUserToAdd({});
            setAddButtonClicked(false);
            setShowAddButton(false);
        }
    }, [addButtonClicked]);


    return (
        <div style={{ textAlign: 'left' }}>
            <Typography style={{ fontSize: '25px' }}>Share Trip</Typography>
            <br></br>
            <Container>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10} sm={10} md={10} alignItems="center">
                        <Autocomplete
                            id="shareToAutocomplete"
                            options={userList}
                            getOptionLabel={(user) => user.email}
                            renderOption={(props, user) => (
                                <li {...props}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={user.profilePicture} alt="Profile" />
                                        <div style={{ marginLeft: '10px' }}>
                                            <Typography>{user.email}</Typography>
                                        </div>
                                    </div>
                                </li>
                            )}
                            filterOptions={(users, { inputValue }) =>
                                users.filter((user) =>
                                    user.email.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            }
                            onChange={(event, newValue) => {
                                if (newValue) {
                                    setUserToAdd({
                                        email: newValue.email,
                                        profilePicture: newValue.profilePicture,
                                    });
                                } else {
                                    setUserToAdd({});
                                }
                                const userAlreadyAdded = addedUsers.some((existingUser) => existingUser.email === newValue.email);
                                const userAlreadyHasAccess = usersWithAccess.some((existingUser) => existingUser.email === newValue.email);

                                if (userAlreadyAdded || userAlreadyHasAccess) {
                                    setShowAddButton(false);
                                } else {
                                    setShowAddButton(true);
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (!newInputValue) {
                                    setUserToAdd({});
                                }
                            }}
                            isOptionEqualToValue={(user, value) => user.email === value.email}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Add people"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        value: userToAdd.email || '',
                                    }}
                                />
                            )}
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
                        {showAddButton ? (
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
                        ) : (
                            <Typography/>
                        )}
                    </Grid>
                </Grid>
                <Typography sx={{ fontWeight: 'bold', marginTop: '3%', marginBottom: '3%' }}>People with Access:</Typography>
                {[...usersWithAccess, ...addedUsers].map((user, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1%'}}>
                        <Avatar src={user.profilePicture} alt="Profile" />
                        <div style={{ marginLeft: '10px' }}>
                            <Typography>{user.email}</Typography>
                        </div>
                    </div>               
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
                        width: '15%'
                    }}
                    onClick={handleCancelButton}
                >
                    Cancel
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
                        width: '15%'
                    }}
                    onClick={handleShareButton}
                >
                    Share
                </Button>
            </Container>
        </div>
    )
}

export default ShareTrip;
