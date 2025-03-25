import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sosyal Medya
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/home">
            Ana Sayfa
          </Button>
          <Button color="inherit" component={RouterLink} to="/profile">
            Profilim
          </Button>
          <Button color="inherit" component={RouterLink} to="/accounts">
            Hesaplar
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Çıkış Yap
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 