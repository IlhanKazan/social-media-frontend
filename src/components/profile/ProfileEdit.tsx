import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Account } from '../../types';
import { updateAccount } from '../../services/accountService';

interface ProfileEditProps {
  account: Account;
  onUpdate: (updatedAccount: Account) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({
  account,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    email: account.email,
    phone: account.phone,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedAccount = await updateAccount(formData);
      onUpdate(updatedAccount);
    } catch (err) {
      setError('Profil güncellenirken bir hata oluştu');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profili Düzenle
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 100, height: 100 }}
        >
          {account.username[0].toUpperCase()}
        </Avatar>
      </Box>
      <TextField
        fullWidth
        label="E-posta"
        name="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Telefon"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
      >
        Kaydet
      </Button>
    </Box>
  );
};

export default ProfileEdit; 