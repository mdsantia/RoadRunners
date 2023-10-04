import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/rr-logo.png'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';


function TopBar() {

  const profile_picture = React.useState("/static/images/avatar/2.jpg");
  const user = useUserContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    navigate('/login');
  };


  const handleSignup = () => {
    navigate('/login');
  };


  return (
    <AppBar position="static" style={{ backgroundColor: 'white', height: '95px' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={Logo} alt="Logo" width={280} />
          <Box sx={{paddingLeft:'60%', paddingTop:'2%'}}>
            {/*show when signed */}
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              UserName
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>

          {/*show when not signed */}
          <Button
          OnClick={handleSignup}
          >Sign Up
          </Button>

          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
} 
export default TopBar;
