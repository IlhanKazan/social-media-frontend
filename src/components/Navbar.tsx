import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getCurrentAccount } from '../services/accountService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const isAuthenticated = !!localStorage.getItem('token');
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (isAuthenticated) {
        try {
          console.log('Token:', localStorage.getItem('token'));
          const account = await getCurrentAccount();
          console.log('Account:', account);
          setCurrentUsername(account.username);
          setUser(account);
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
        }
      }
    };

    fetchCurrentUser();
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Ilhan Twitteri
        </Typography>
        <Box>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/home')}>
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