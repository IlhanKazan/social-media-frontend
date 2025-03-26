import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  TextField,
  Collapse,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { 
  ThumbUp, 
  ThumbDown, 
  Comment, 
  Share,
  MoreVert,
  Send,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Edit,
  Delete
} from '@mui/icons-material';
import { Post } from '../../types';
import { useNavigate } from 'react-router-dom';
import CommentList from './CommentList';
import { useAuth } from '../../hooks/useAuth';
import { deletePost, updatePost, getPost } from '../../services/postService';

interface PostCardProps {
  post: Post;
  onLike?: (postId: number, interactionId?: number) => Promise<void>;
  onDislike?: (postId: number, interactionId?: number) => Promise<void>;
  onComment?: (content: string, postId: number, interactionId?: number) => Promise<void>;
  onPostDeleted?: (postId: number) => Promise<void>;
  onPostUpdated?: (updatedPost: Post) => Promise<void>;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onDislike, 
  onComment,
  onPostDeleted,
  onPostUpdated 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editContent, setEditContent] = useState(post.context);
  const [isLoading, setIsLoading] = useState(false);

  const likeCount = post.interactions.filter(i => i.type === 1).length;
  const dislikeCount = post.interactions.filter(i => i.type === 2).length;
  const commentCount = post.interactions.filter(i => i.type === 0).length;
  const isPostOwner = user?.username === post.accountUsername;
  const userLike = post.interactions.find(i => i.type === 1 && i.accountUsername === user?.username);
  const userDislike = post.interactions.find(i => i.type === 2 && i.accountUsername === user?.username);

  const handleProfileClick = () => {
    if (post.accountUsername) {
      navigate(`/profile/${post.accountUsername}`);
    }
  };

  const handleCommentClick = () => {
    if (showComments && showCommentInput) {
      setShowCommentInput(false);
      setShowComments(false);
    } else {
      setShowCommentInput(true);
      setShowComments(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentContent.trim()) {
      try {
        await onComment?.(commentContent, post.postId);
        setCommentContent('');
        setShowCommentInput(false);
      } catch (error) {
        console.error('Yorum gönderme hatası:', error);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setShowEditDialog(true);
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deletePost(post.postId);
      setShowDeleteDialog(false);
      if (onPostDeleted) {
        await onPostDeleted(post.postId);
      }
    } catch (error: any) {
      console.error('Post silme hatası:', error);
      if (error.response?.status === 403) {
        alert('Bu işlem için yetkiniz yok.');
      } else {
        alert('Post silinirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      setIsLoading(true);
      const updatedPost = await updatePost(post.postId, editContent);
      setShowEditDialog(false);
      if (onPostUpdated) {
        await onPostUpdated(updatedPost);
      }
    } catch (error: any) {
      console.error('Post güncelleme hatası:', error);
      if (error.response?.status === 403) {
        alert('Bu işlem için yetkiniz yok.');
      } else {
        alert('Post güncellenirken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentUpdated = async () => {
    try {
      const updatedPost = await getPost(post.postId);
      if (onPostUpdated) {
        await onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error('Yorum güncelleme hatası:', error);
    }
  };

  const handleCommentDeleted = async () => {
    try {
      const updatedPost = await getPost(post.postId);
      if (onPostUpdated) {
        await onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
    }
  };

  const handleLike = async () => {
    const existingLike = post.interactions.find(i => i.type === 1 && i.accountUsername === user?.username);
    const existingDislike = post.interactions.find(i => i.type === 2 && i.accountUsername === user?.username);
    
    if (existingLike) {
      // Mevcut like'ı sil
      await onLike?.(post.postId, existingLike.interactionId);
    } else if (existingDislike) {
      // Önce dislike'ı sil, sonra like ekle
      await onDislike?.(post.postId, existingDislike.interactionId);
      await onLike?.(post.postId);
    } else {
      // Yeni like ekle
      await onLike?.(post.postId);
    }
  };

  const handleDislike = async () => {
    const existingLike = post.interactions.find(i => i.type === 1 && i.accountUsername === user?.username);
    const existingDislike = post.interactions.find(i => i.type === 2 && i.accountUsername === user?.username);
    
    if (existingDislike) {
      // Mevcut dislike'ı sil
      await onDislike?.(post.postId, existingDislike.interactionId);
    } else if (existingLike) {
      // Önce like'ı sil, sonra dislike ekle
      await onLike?.(post.postId, existingLike.interactionId);
      await onDislike?.(post.postId);
    } else {
      // Yeni dislike ekle
      await onDislike?.(post.postId);
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 1,
        borderRadius: 0,
        boxShadow: 'none',
        borderBottom: '1px solid #eee',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar 
            onClick={handleProfileClick}
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              cursor: 'pointer'
            }}
          >
            {post.accountUsername && post.accountUsername[0].toUpperCase()}
          </Avatar>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Button 
                onClick={handleProfileClick}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  p: 0,
                  minWidth: 'auto',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'underline'
                  }
                }}
              >
                {post.accountUsername}
              </Button>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mr: 1, ml: 2 }}
              >
                {new Date(post.createDate).toLocaleDateString('tr-TR')} {new Date(post.createDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              {isPostOwner && (
                <IconButton 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={handleMenuOpen}
                >
                  <MoreVert />
                </IconButton>
              )}
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEditClick}>
                <Edit sx={{ mr: 1, fontSize: 20 }} />
                Düzenle
              </MenuItem>
              <MenuItem onClick={handleDeleteClick}>
                <Delete sx={{ mr: 1, fontSize: 20 }} />
                Sil
              </MenuItem>
            </Menu>

            {/* Delete Dialog */}
            <Dialog
              open={showDeleteDialog}
              onClose={() => setShowDeleteDialog(false)}
            >
              <DialogTitle>Gönderiyi Sil</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Bu gönderiyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setShowDeleteDialog(false)} 
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button 
                  onClick={() => handleDelete()} 
                  color="error" 
                  disabled={isLoading}
                >
                  Sil
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog
              open={showEditDialog}
              onClose={() => setShowEditDialog(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Gönderiyi Düzenle</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setShowEditDialog(false)} 
                  disabled={isLoading}
                >
                  İptal
                </Button>
                <Button 
                  onClick={handleEdit} 
                  color="primary" 
                  disabled={isLoading || !editContent.trim()}
                >
                  Kaydet
                </Button>
              </DialogActions>
            </Dialog>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                whiteSpace: 'pre-wrap',
                fontSize: '1rem',
                lineHeight: 1.5
              }}
            >
              {post.context}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              maxWidth: 425,
              color: 'text.secondary'
            }}>
              <Button
                size="small"
                onClick={handleCommentClick}
                startIcon={<Comment sx={{ fontSize: 20 }} />}
                endIcon={showComments ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(29, 155, 240, 0.1)'
                  }
                }}
              >
                {commentCount} Yorum
              </Button>

              <IconButton 
                size="small"
                onClick={handleLike}
                sx={{ 
                  '&:hover': {
                    color: 'success.main',
                    backgroundColor: 'rgba(0, 186, 124, 0.1)'
                  }
                }}
              >
                <ThumbUp 
                  sx={{ 
                    fontSize: 20,
                    color: userLike ? 'success.main' : 'inherit'
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {likeCount}
                </Typography>
              </IconButton>

              <IconButton 
                size="small"
                onClick={handleDislike}
                sx={{ 
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'rgba(249, 24, 128, 0.1)'
                  }
                }}
              >
                <ThumbDown 
                  sx={{ 
                    fontSize: 20,
                    color: userDislike ? 'error.main' : 'inherit'
                  }} 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {dislikeCount}
                </Typography>
              </IconButton>

              <IconButton 
                size="small"
                sx={{ 
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(29, 155, 240, 0.1)'
                  }
                }}
              >
                <Share sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            <Collapse in={showComments || showCommentInput}>
              {showCommentInput && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Yorum yaz..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && commentContent.trim()) {
                        e.preventDefault();
                        handleCommentSubmit();
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }
                    }}
                  />
                  <IconButton 
                    onClick={handleCommentSubmit}
                    disabled={!commentContent.trim()}
                    sx={{ 
                      color: 'primary.main',
                      '&:hover': {
                        backgroundColor: 'rgba(29, 155, 240, 0.1)'
                      }
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
              )}
              <CommentList 
                comments={post.interactions} 
                onCommentDeleted={handleCommentDeleted}
                onCommentUpdated={handleCommentUpdated}
              />
            </Collapse>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard; 