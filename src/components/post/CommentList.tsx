import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { 
  MoreVert,
  Edit,
  Delete,
  Send
} from '@mui/icons-material';
import { Interaction } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface CommentListProps {
  comments: Interaction[];
  onCommentDeleted?: () => void;
  onCommentUpdated?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ 
  comments,
  onCommentDeleted,
  onCommentUpdated
}) => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<Interaction | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, comment: Interaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    if (selectedComment?.context) {
      setEditContent(selectedComment.context);
      setShowEditDialog(true);
      setAnchorEl(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;
    
    try {
      setIsLoading(true);
      const response = await api.get(`/interaction/delete/${selectedComment.interactionId}`);
      if (response.status === 200) {
        setShowDeleteDialog(false);
        if (onCommentDeleted) {
          onCommentDeleted();
        }
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedComment || !editContent.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await api.post('/interaction/update', {
        interactionId: selectedComment.interactionId,
        context: editContent,
        type: 0
      });
      if (response.status === 200) {
        setShowEditDialog(false);
        if (onCommentUpdated) {
          onCommentUpdated();
        }
      }
    } catch (error) {
      console.error('Yorum güncelleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComments = comments.filter(comment => comment.type === 0);

  return (
    <Box sx={{ mt: 2 }}>
      {filteredComments.map((comment) => (
        <Box 
          key={comment.interactionId} 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-start',
            mb: 2,
            position: 'relative'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'bold',
                  mr: 1
                }}
              >
                {comment.accountUsername}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ mr: 1, ml: 2 }}
              >
                {new Date(comment.createDate).toLocaleDateString('tr-TR')} {new Date(comment.createDate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              {user?.username === comment.accountUsername && (
                <IconButton 
                  size="small" 
                  sx={{ 
                    ml: 'auto',
                    color: 'text.secondary',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  onClick={(e) => handleMenuOpen(e, comment)}
                >
                  <MoreVert sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.primary',
                whiteSpace: 'pre-wrap'
              }}
            >
              {comment.context}
            </Typography>
          </Box>
        </Box>
      ))}

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
        <DialogTitle>Yorumu Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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
        <DialogTitle>Yorumu Düzenle</DialogTitle>
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
            onClick={() => handleEdit()} 
            color="primary" 
            disabled={isLoading || !editContent.trim()}
          >
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommentList; 