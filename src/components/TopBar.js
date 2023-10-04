import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/rr-logo.png';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';
import Avatar from '@mui/material/Avatar';
import { Link } from '@mui/material'; // Import Link component

function TopBar() {
  const { user, logout } = useUserContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const profile_picture = user ? user.profile_picture : "/static/images/avatar/2.jpg";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(`/profile/${user._id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', height: '95px' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/" underline="none"> {/* Make the logo clickable */}
            <img src={Logo} alt="Logo" width={280} />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <div>
                <Button
                  id="basic-button"
                  aria-controls={anchorEl ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <Avatar src={profile_picture} alt="Profile" />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleProfile}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button onClick={handleLogin}>Log in</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopBar;