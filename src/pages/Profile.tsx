import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import { Account } from '../types';
import { getAccountByUsername } from '../services/accountService';
import PostList from '../components/post/PostList';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const data = await getAccountByUsername(username || '');
        setAccount(data);
      } catch (err) {
        setError('Kullanıcı bilgileri yüklenirken bir hata oluştu.');
        console.error('Profil yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchAccountData();
    }
  }, [username]);

  const handleInteraction = async (postId: number, type: 'LIKE' | 'DISLIKE' | 'COMMENT', content?: string, interactionId?: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Lütfen önce giriş yapın');
        return;
      }

      if (interactionId) {
        // Eğer interactionId varsa, etkileşimi sil
        await api.get(`/interaction/delete/${interactionId}`);
      } else {
        // Yoksa yeni etkileşim ekle
        await api.post('/interaction/save', {
          postId,
          context: type === 'COMMENT' ? content : type === 'LIKE' ? 'like' : 'dislike',
          type: type === 'LIKE' ? 1 : type === 'DISLIKE' ? 2 : 0
        });
      }

      // Profil verilerini yeniden yükle
      if (username) {
        const updatedData = await getAccountByUsername(username);
        setAccount(updatedData);
      }
    } catch (err: any) {
      console.error('Etkileşim hatası:', err);
      if (err.response?.status === 403) {
        setError('Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.');
      } else {
        setError(`${type === 'LIKE' ? 'Beğeni' : type === 'DISLIKE' ? 'Beğenmeme' : 'Yorum'} işlemi başarısız oldu`);
      }
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !account) {
    return (
      <Container>
        <Typography color="error">
          {error || 'Kullanıcı bulunamadı'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{ width: 100, height: 100, mr: 2 }}
            >
              {account.username[0].toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom>
                  {account.username}
                </Typography>
                {user?.username === account.username && (
                  <IconButton
                    size="large"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'rgba(29, 155, 240, 0.1)'
                      }
                    }}
                    onClick={() => navigate('/settings')}
                  >
                    <Settings />
                  </IconButton>
                )}
              </Box>
              <Typography color="text.secondary" gutterBottom>
                {account.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Katılma Tarihi: {new Date(account.createDate).toLocaleDateString('tr-TR')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        Gönderiler
      </Typography>

      <PostList 
        username={account.username} 
        posts={account.posts}
        onLike={(postId, interactionId) => handleInteraction(postId, 'LIKE', undefined, interactionId)}
        onDislike={(postId, interactionId) => handleInteraction(postId, 'DISLIKE', undefined, interactionId)}
        onComment={(content, postId, interactionId) => handleInteraction(postId, 'COMMENT', content, interactionId)}
      />
    </Container>
  );
};

export default Profile; 