import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../../assets/rr-logo.png';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';
import Avatar from '@mui/material/Avatar';
import { Link } from '@mui/material'; // Import Link component
import { pageOptions } from '../userProfile/SideBar';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

function TopBar(props) {
  const { user, logout } = useUserContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const profile_picture = user ? user.profile_picture : "/static/images/avatar/2.jpg";
  const { handleLock, locked } = props;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate(`/profile/${pageOptions[pageOptions.length - 2]}/${user._id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'white', height: '75px' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link href="/" underline="none"> {/* Make the logo clickable */}
            <img src={Logo} alt="Logo" width={280} />
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <div>
                <>
                {props.showLock && (
                  props.locked ? (
                    <Button onClick={() => handleLock(false)} startIcon={<LockIcon />}>Unlock</Button>
                  ) : (
                    <Button onClick={() => handleLock(true)} startIcon={<LockOpenIcon />}>Lock</Button>
                  )
                  )
                }
                </>

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