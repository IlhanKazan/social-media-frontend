import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material';
import api from '../../services/api';

interface CreatePostProps {
  onPostCreated: () => Promise<void>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Gönderi içeriği boş olamaz');
      return;
    }

    try {
      await api.post('/post/save', {
        context: content
      });

      setContent('');
      await onPostCreated();
    } catch (err: any) {
      console.error('Gönderi oluşturma hatası:', err);
      setError('Gönderi oluşturulurken bir hata oluştu');
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Ne düşünüyorsun?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!content.trim()}
          >
            Paylaş
          </Button>
        </Box>
        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </form>
    </Paper>
  );
};

export default CreatePost; 