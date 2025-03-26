import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { globalRefresh } from '../pages/Home';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleHomeClick = () => {
    if (location.pathname === '/home') {
      if (globalRefresh) {
        globalRefresh();
      }
    } else {
      navigate('/home');
    }
  };

  const handleLogoClick = () => {
    if (user) {
      handleHomeClick();
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
          onClick={handleLogoClick}
        >
          Ilhan Twitteri
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" onClick={handleHomeClick}>
                Ana Sayfa
              </Button>
              <Button color="inherit" onClick={() => navigate(`/profile/${user.username}`)}>
                Profil
              </Button>
              <Button color="inherit" onClick={() => navigate('/settings')}>
                Ayarlar
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/')}>
                Giriş Yap
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Kayıt Ol
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 