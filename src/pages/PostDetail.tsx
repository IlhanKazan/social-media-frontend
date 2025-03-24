import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  TextField,
  Box,
  CardHeader,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import api from '../services/api';
import { Post, Interaction } from '../types/post';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showAllComments, setShowAllComments] = useState(false);

  const fetchPost = async () => {
    try {
      const response = await api.get<Post>(`/post/get-by-id/${id}`);
      console.log('Post Response:', response.data);
      console.log('Comments:', response.data.interactions?.filter((i: Interaction) => i.type === 0));
      setPost(response.data);
    } catch (err) {
      const error = err as AxiosError;
      console.error('Error fetching post:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(`Hata: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        console.error('Error message:', error.message);
        setError(`Bir hata oluştu: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/interaction/save`, {
        postId: Number(id),
        type: 0,
        context: newComment
      });
      setNewComment('');
      await fetchPost();
    } catch (err) {
      setError('Yorum gönderilirken bir hata oluştu');
    }
  };

  if (!post) {
    return (
      <Container>
        <Typography>
          {error || 'Yükleniyor...'}
        </Typography>
      </Container>
    );
  }

  const comments = post.interactions?.filter(i => i.type === 0) || [];
  const displayedComments = showAllComments ? comments : comments.slice(0, 4);

  return (
    <Container maxWidth="md">
      <Card sx={{ mt: 4, mb: 2 }}>
        <CardHeader
          avatar={
            <Avatar>
              {post.accountUsername[0].toUpperCase()}
            </Avatar>
          }
          title={post.accountUsername}
          subheader={new Date(post.createDate).toLocaleDateString('tr-TR')}
        />
        <CardContent>
          <Typography variant="body1">
            {post.context}
          </Typography>
        </CardContent>
        <CardActions>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              <FavoriteBorderIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {post.interactions?.filter(i => i.type === 1).length || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              <ThumbDownOffAltIcon />
            </IconButton>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {post.interactions?.filter(i => i.type === 2).length || 0}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small">
              <CommentIcon />
            </IconButton>
            <Typography variant="body2">
              {comments.length}
            </Typography>
          </Box>
        </CardActions>
        <Divider />
        {comments.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            {displayedComments.map((comment) => (
              <Box key={comment.interactionId} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    {comment.accountUsername[0].toUpperCase()}
                  </Avatar>
                  <Typography variant="subtitle2">
                    {comment.accountUsername}
                  </Typography>
                  <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    {new Date(comment.createDate).toLocaleDateString('tr-TR')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 4 }}>
                  {comment.context}
                </Typography>
              </Box>
            ))}
            
            {comments.length > 4 && !showAllComments && (
              <Button
                size="small"
                sx={{ ml: 4, mt: 1 }}
                onClick={() => setShowAllComments(true)}
              >
                {comments.length - 4} yorum daha göster
              </Button>
            )}
            
            {showAllComments && comments.length > 4 && (
              <Button
                size="small"
                sx={{ ml: 4, mt: 1 }}
                onClick={() => setShowAllComments(false)}
              >
                Daha az göster
              </Button>
            )}
          </Box>
        )}
        <Divider />
        <Box sx={{ p: 2 }}>
          <Box component="form" onSubmit={handleComment} sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Yorum yaz..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <IconButton type="submit" disabled={!newComment.trim()}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default PostDetail; 