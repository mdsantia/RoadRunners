import * as React from 'react';
import { Container, Avatar } from '@mui/material';
import { Typography, Grid, Divider, Select, TextField } from '@mui/material';
import { MenuItem, Button, Autocomplete, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useUserContext } from '../../hooks/useUserContext';
import FormControl from '@mui/material/FormControl';
import ConfirmDialog from '../additionalFeatures/ConfirmDialog';
import axios from 'axios';
import { useDashboardContext } from '../../context/DashboardContext';


function ShareTrip ({handleShareTripDialog}) {
    const {user, updateUser} = useUserContext();
    const [userList, setUserList] = React.useState([]);
    const [userToAdd, setUserToAdd] = React.useState(null);
    const [addedUsers, setAddedUsers] = React.useState([]);
    const [usersWithAccess, setUsersWithAccess] = React.useState([]);
    const [addButtonClicked, setAddButtonClicked] = React.useState(false);
    const [showAddButton, setShowAddButton] = React.useState(false);
    const [initialStateString, setInitialStateString] = React.useState(null);
    const [initialState, setInitialState] = React.useState(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
    const [snackbarDuration, setSnackbarDuration] = React.useState(2000);
    const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
    const { tripDetails, setTripDetails } = useDashboardContext();

    React.useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/api/user/getAllUsers`) 
            .then((res) => {
                setUserList(res.data);
                setUserList(userList => userList.filter(userOnList => userOnList.email !== user.email));
                for (let i = 0; i < userList.length; i++) {
                    userList[i].permission = 3;
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
        fetchData();
        
        const result = tripDetails.users_shared;
        setUsersWithAccess(result);
        setInitialStateString(JSON.stringify(result));
        setInitialState(result);
    }, []);

    const showCancelAndSaveButton = () => {
        if (initialStateString !== JSON.stringify(usersWithAccess) || addedUsers.length) {
            // Checks to see if the users in addedUsers already exist in the initial list of usersWithAccess
            if (addedUsers.length) {
                const allUsersExist = addedUsers.every((addedUser) => initialState.some((initialStateUser) => initialStateUser.email === addedUser.email));
                if (!allUsersExist || (addedUsers.length !== initialState.length)) {
                    return true;
                } else {
                    // if the users in addedUsers already exist in the initial list of usersWithAccess,
                    // then checks to see if their permissions are the same as they were initially
                    const filteredInitialUsers = initialState.filter((initialStateUser) => addedUsers.some((addedUser) => addedUser.email === initialStateUser.email));
                    for (let i = 0; i < filteredInitialUsers.length; i++) {
                        const user = addedUsers.find((addedUser) => addedUser.email === filteredInitialUsers[i].email);
                        if (user.permission !== filteredInitialUsers[i].permission) {
                            return true;
                        }
                    }
                }
            } else {
                return true;
            }
        }
        return false;
    }

    const handlePermissionChange = (event, selectedUser) => {
        if (event.target.value === 3) {
            const updatedUsers = addedUsers.filter((user) => user.email !== selectedUser.email);
            setAddedUsers(updatedUsers);
            const updatedUsersAccess = usersWithAccess.filter((user) => user.email !== selectedUser.email);
            setUsersWithAccess(updatedUsersAccess);
        } else {
            const updatedUsers = addedUsers.map((user) =>
            user.email === selectedUser.email ? { ...user, permission: event.target.value } : user
            );
            const updatedUsersAccess = usersWithAccess.map((user) =>
                user.email === selectedUser.email ? { ...user, permission: event.target.value } : user
            );
            setUsersWithAccess(updatedUsersAccess);
            setAddedUsers(updatedUsers);
        }
    };
    
    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }

    const handleShowAddButton = (user) => {
        const userAlreadyAdded = addedUsers.some((existingUser) => existingUser.email === user.email);
        const userAlreadyHasAccess = usersWithAccess.some((existingUser) => existingUser.email === user.email);

        if (userAlreadyAdded || userAlreadyHasAccess) {
            setShowAddButton(false);
        } else {
            setShowAddButton(true);
        }
    }

    const handleDoneButton = () => {
        setAddedUsers([]);
        setUserToAdd(null);
        handleShareTripDialog();
    }
    
    const handleSaveButton = async () => {
        await shareTrip();
    }

    const shareTrip = async () => {
        await axios.post('/api/trip/shareTrip', {
          tripId: tripDetails._id,
          senderName: user.name,
          senderEmail: user.email,
          senderProfilePicture: user.profile_picture,
          usersWithAccess: usersWithAccess,
          addedUsers: addedUsers,
          initialState: initialState,
        }).then((response) => {
           const data = response.data;
            setUsersWithAccess(data.users_shared);
            setAddedUsers([]);
            setUserToAdd(null);
            setInitialStateString(JSON.stringify(data.users_shared));
            setInitialState(data.users_shared);
            setTripDetails(data.trip);
            showMessage('Your changes have been saved!', 2000, 'success');
        }
        ).catch((error) => {
          console.log(error);
        });
    }

    const handleCancelButton = () => {
        setAddedUsers([]);
        setUserToAdd(null);
        handleShareTripDialog();
    }

    const handleConfirmDialog = () => {
        if (confirmDialogOpen) {
            setConfirmDialogOpen(false);
        } else {
            setConfirmDialogOpen(true);
        }
    }

    const showMessage = (message, duration, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarDuration(duration);
        setSnackbarOpen(true);
    };

    const closeSnackbar = () => {
        setSnackbarOpen(false);
    };

    React.useEffect(() => {
        if (addButtonClicked) {
            setAddedUsers(prevUsers => [...prevUsers, userToAdd]);
            setUserToAdd(null);
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
                            value={userToAdd}
                            options={userList}
                            getOptionLabel={(user) => user.email}
                            renderOption={(props, user) => {
                                return (
                                <li {...props} style={{ display: 'flex', alignItems: 'center'}}  
                                >
                                    <Avatar src={user.profile_picture} alt="Profile" />
                                    <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontSize: '15px' }}>{user.name}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'gray' }}>{user.email}</Typography>
                                    </div>
                              </li>
                            )}}
                            filterOptions={(users, { inputValue }) =>
                                users.filter((user) =>
                                    !addedUsers.some((addedUser) => addedUser.email === user.email) &&
                                    !usersWithAccess.some((userWithAccess) => userWithAccess.email === user.email) &&
                                    user.email.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            }
                            onChange={(event, user) => {
                                if (user) {
                                    setUserToAdd({
                                        email: user.email,
                                        name: user.name,
                                        profile_picture: user.profile_picture,
                                        permission: 1
                                    });
                                    handleShowAddButton(user);
                                } else {
                                    setUserToAdd(null);
                                    setShowAddButton(false);
                                }
                            }}
                            isOptionEqualToValue={(user, value) => user.email === value.email}
                            renderInput={(params) => {
                                return (
                                    <TextField
                                        {...params}
                                        label="Add people"
                                        variant="outlined"
                                        fullWidth
                                    />
                                );
                            }}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
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
                <Grid container style={{ marginBottom: '3%' }}>
                    <Grid item xs={9} sm={9} md={9}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                        <Avatar src={tripDetails.owner.profile_picture} alt="Profile" />
                        <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography sx={{ fontSize: '15px' }}>{user.name}{tripDetails.owner.email === user.email ? ` (you)` : null}</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>{tripDetails.owner.email}</Typography>
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography sx={{ color: 'gray'}}>Owner</Typography>
                        </div>
                    </Grid>
                </Grid>
                {[...usersWithAccess, ...addedUsers].map((u, index) => (
                    <Grid container style={{ marginBottom: '3%'}} key={index}>
                        <Grid item xs={9} sm={9} md={9}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                            <Avatar src={u.profile_picture} alt="Profile" />
                            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography sx={{ fontSize: '15px' }}>{u.name}{u.email === user.email ? ` (you)` : null}</Typography>
                                <Typography sx={{ fontSize: '12px', color: 'grey' }}>{u.email}</Typography>
                            </div>
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                <FormControl fullWidth variant="standard" sx={{ width: '80%' }}>
                                    <Select
                                        id="permission-select"
                                        value={u.permission}
                                        onChange={(event) => handlePermissionChange(event, u)}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Set the desired background color on hover
                                            },
                                            textAlign: 'center',
                                        }}
                                    >
                                        <MenuItem value={1}>Viewer</MenuItem>
                                        <MenuItem value={2}>Editor</MenuItem>
                                        <Divider/>
                                        <MenuItem value={3}>Remove Access</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>
                ))}
            </Container>
            <Container style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '3%' }}>
                {showCancelAndSaveButton() && (
                    <>
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
                            onClick={handleConfirmDialog}
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
                            onClick={handleSaveButton}
                        >
                            Save
                        </Button>
                    </>
                )}
                {!showCancelAndSaveButton() && (
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
                            width: '15%',
                            marginLeft: 'auto',
                        }}
                        onClick={handleDoneButton}
                    >
                        Done
                    </Button>
                )}
            </Container>
            <Snackbar open={snackbarOpen} autoHideDuration={snackbarDuration} onClose={closeSnackbar}>
                <MuiAlert elevation={6} variant="filled" onClose={closeSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar> 
            <ConfirmDialog
                open={confirmDialogOpen}
                onClose={handleConfirmDialog}
                onConfirm={handleCancelButton}
            />
        </div>
    )
}

export default ShareTrip;