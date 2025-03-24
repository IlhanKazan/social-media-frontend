import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { updateAccount, getYourTokenInfo } from '../services/accountService';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    try {
      const tokenInfo = getYourTokenInfo();
      setForm(prev => ({
        ...prev,
        email: tokenInfo.email,
        phone: tokenInfo.phone
      }));
    } catch (error) {
      console.error('Token bilgileri alınamadı:', error);
      setError('Kullanıcı bilgileri alınamadı');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Şifre kontrolü
    if (form.password && form.password !== form.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      await updateAccount({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password || ""
      });
      setSuccess('Bilgileriniz başarıyla güncellendi');
      setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err: any) {
      console.error('Güncelleme hatası:', err);
      if (err.response?.status === 403) {
        setError('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.');
      } else {
        setError(err.response?.data?.message || 'Bilgiler güncellenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await api.get('/account/delete');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (err: any) {
      console.error('Hesap silme hatası:', err);
      setError(err.response?.data?.message || 'Hesap silinirken bir hata oluştu');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Hesap Ayarları
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="username"
              value={form.username}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="E-posta"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Telefon"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Yeni Şifre (Opsiyonel)"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              helperText="Şifrenizi değiştirmek istemiyorsanız boş bırakın"
            />

            <TextField
              fullWidth
              label="Yeni Şifre Tekrar"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
              error={!!form.password && form.password !== form.confirmPassword}
              helperText={!!form.password && form.password !== form.confirmPassword ? "Şifreler eşleşmiyor" : ""}
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ flex: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Kaydet'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/profile/${user.username}`)}
                sx={{ flex: 1 }}
              >
                İptal
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Typography variant="h6" color="error" gutterBottom>
          Tehlikeli Bölge
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          disabled={loading}
        >
          Hesabı Sil
        </Button>
      </Box>

      {/* Hesap Silme Onay Dialog'u */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Hesabınızı Silmek İstediğinizden Emin misiniz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu işlem geri alınamaz. Hesabınız ve tüm verileriniz kalıcı olarak silinecektir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            disabled={loading}
          >
            İptal
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            color="error"
            disabled={loading}
            autoFocus
          >
            {loading ? <CircularProgress size={24} /> : 'Evet, Hesabımı Sil'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Settings; 