import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Post, Interaction } from '../../types';
import api from '../../services/api';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import { useAuth } from '../../hooks/useAuth';
import { AxiosResponse } from 'axios';

interface PostListProps {
  onPostCreated?: () => Promise<void>;
  username?: string;
  posts?: Post[];
  onLike?: (postId: number, interactionId?: number) => Promise<void>;
  onDislike?: (postId: number, interactionId?: number) => Promise<void>;
  onComment?: (content: string, postId: number, interactionId?: number) => Promise<void>;
}

interface InteractionResponse {
  interactionId: number;
  postId: number;
  accountId: number;
  accountUsername: string;
  context: string;
  type: number;
  createDate: string;
  updateDate: string | null;
  status: number;
}

const PostList: React.FC<PostListProps> = ({ 
  onPostCreated, 
  username, 
  posts: initialPosts,
  onLike,
  onDislike,
  onComment
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      if (username && initialPosts) {
        // Profil sayfasında account'tan gelen posts verisini kullan
        // Her post'a accountUsername ekle
        const postsWithUsername = initialPosts.map(post => ({
          ...post,
          accountUsername: username
        }));
        setPosts(postsWithUsername);
      } else {
        // Ana sayfada tüm gönderileri getir
        const response = await api.get('/post/get-all');
        
        let fetchedPosts: Post[] = [];
        if (Array.isArray(response.data)) {
          fetchedPosts = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          fetchedPosts = response.data.content;
        } else {
          console.error('Geçersiz API yanıtı:', response.data);
          setError('Sunucudan geçersiz veri formatı alındı');
          return;
        }
        setPosts(fetchedPosts);
      }
    } catch (err: any) {
      console.error('Post yükleme hatası:', err);
      if (err.response) {
        setError(err.response.data.message || 'Gönderiler yüklenirken bir hata oluştu');
      } else if (err.request) {
        setError('Sunucuya bağlanılamadı');
      } else {
        setError('İstek oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [username, initialPosts]);

  const handlePostCreated = async () => {
    await fetchPosts();
    if (onPostCreated) {
      await onPostCreated();
    }
  };

  const handleInteraction = async (postId: number, type: 'like' | 'dislike' | 'comment', content?: string, interactionId?: number) => {
    try {
      if (interactionId) {
        // Eğer interactionId varsa, mevcut etkileşimi sil
        await api.get(`/interaction/delete/${interactionId}`);
      } else {
        // Yeni etkileşim ekle
        await api.post('/interaction/save', {
          postId,
          context: type === 'comment' ? content : type === 'like' ? 'like' : 'dislike',
          type: type === 'like' ? 1 : type === 'dislike' ? 2 : 0
        });
      }

      // Post verilerini güncelle
      const response = await api.get(username ? `/post/user/${username}` : '/post/get-all');
      if (response.status === 200) {
        let fetchedPosts: Post[] = [];
        if (Array.isArray(response.data)) {
          fetchedPosts = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          fetchedPosts = response.data.content;
        }
        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error('Etkileşim hatası:', error);
    }
  };

  const handlePostDeleted = async () => {
    await fetchPosts();
  };

  const handlePostUpdated = async (updatedPost: Post) => {
    try {
      // Önce local state'i güncelle
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.postId === updatedPost.postId ? updatedPost : post
        )
      );

      // Sonra API'den güncel verileri al
      const response = await api.get(username ? `/post/user/${username}` : '/post/get-all');
      if (response.status === 200) {
        let fetchedPosts: Post[] = [];
        if (Array.isArray(response.data)) {
          fetchedPosts = response.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          fetchedPosts = response.data.content;
        }
        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error('Post güncelleme hatası:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '200px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {!username && <CreatePost onPostCreated={handlePostCreated} />}
      {error && (
        <Typography 
          color="error" 
          sx={{ 
            p: 2,
            textAlign: 'center',
            backgroundColor: 'error.light',
            color: 'error.contrastText'
          }}
        >
          {error}
        </Typography>
      )}
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onLike={onLike ? (postId, interactionId) => onLike(postId, interactionId) : (postId, interactionId) => handleInteraction(postId, 'like', undefined, interactionId)}
          onDislike={onDislike ? (postId, interactionId) => onDislike(postId, interactionId) : (postId, interactionId) => handleInteraction(postId, 'dislike', undefined, interactionId)}
          onComment={onComment ? (content, postId, interactionId) => onComment(content, postId, interactionId) : (content) => handleInteraction(post.postId, 'comment', content)}
          onPostDeleted={handlePostDeleted}
          onPostUpdated={handlePostUpdated}
        />
      ))}
    </Box>
  );
};

export default PostList; 