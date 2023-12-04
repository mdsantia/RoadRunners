import * as React from 'react';
import { Container, Avatar } from '@mui/material';
import { Typography, Grid, Divider, Select, OutlinedInput, InputLabel, TextField } from '@mui/material';
import { MenuItem, Button, Autocomplete } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
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
    const [showAddButton, setShowAddButton] = React.useState(false);
    const {user, updateUser} = useUserContext();

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
    }, []);

    const handleAddButtonClick = () => {
        setAddButtonClicked(true);
    }

    const handlePermissionChange = (event, selectedUser) => {
        if (event.target.value === 3) {
            // Remove the user from addedUsers
            const updatedUsers = addedUsers.filter((user) => user.email !== selectedUser.email);
            setAddedUsers(updatedUsers);
        } else {
            // Update the permission for other cases
            const updatedUsers = addedUsers.map((user) =>
                user.email === selectedUser.email ? { ...user, permission: event.target.value } : user
            );
            setAddedUsers(updatedUsers);
        }
    };
    
    const handleShareButton = () => {
        setUsersWithAccess(prevUsers => [...prevUsers, ...addedUsers]);
        setAddedUsers([]);
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
                                <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={user.profile_picture} alt="Profile" />
                                    <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <Typography sx={{ fontSize: '15px' }}>{user.name}</Typography>
                                    <Typography sx={{ fontSize: '12px', color: 'gray' }}>{user.email}</Typography>
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
                                        name: newValue.name,
                                        profile_picture: newValue.profile_picture,
                                        permission: 1
                                    });
                                    const userAlreadyAdded = addedUsers.some((existingUser) => existingUser.email === newValue.email);
                                    const userAlreadyHasAccess = usersWithAccess.some((existingUser) => existingUser.email === newValue.email);
    
                                    if (userAlreadyAdded || userAlreadyHasAccess) {
                                        setShowAddButton(false);
                                    } else {
                                        setShowAddButton(true);
                                    }
                                } else {
                                    setUserToAdd({});
                                    setShowAddButton(false);
                                }
                            }}
                            onInputChange={(event, newInputValue) => {
                                if (!newInputValue) {
                                    setUserToAdd({});
                                    setShowAddButton(false);
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
                                        value: userToAdd ? userToAdd.email || '' : '',
                                    }}
                                />
                            )}
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
                        <Avatar src={user.profile_picture} alt="Profile" />
                        <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography sx={{ fontSize: '15px' }}>{user.name} (you)</Typography>
                            <Typography sx={{ fontSize: '12px', color: 'grey' }}>{user.email}</Typography>
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                        <Typography sx={{ color: 'gray'}}>Owner</Typography>
                        </div>
                    </Grid>
                </Grid>
                {[...usersWithAccess, ...addedUsers].map((user, index) => (
                    <Grid container style={{ marginBottom: '3%'}}>
                        <Grid item xs={9} sm={9} md={9}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1%' }}>
                            <Avatar src={user.profile_picture} alt="Profile" />
                            <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography sx={{ fontSize: '15px' }}>{user.name}</Typography>
                                <Typography sx={{ fontSize: '12px', color: 'grey' }}>{user.email}</Typography>
                            </div>
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                                <FormControl fullWidth variant="standard" sx={{ width: '80%' }}>
                                    <Select
                                        labelId={`permission-label-${user.email}`}
                                        id={`permission-select-${user.email}`}
                                        value={user.permission}
                                        onChange={(event) => handlePermissionChange(event, user)}
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
