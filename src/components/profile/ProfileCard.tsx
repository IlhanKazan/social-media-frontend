import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Account } from '../../types';

interface ProfileCardProps {
  account: Account;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  account,
  isOwnProfile,
  onEdit,
}) => {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            sx={{ width: 100, height: 100 }}
          >
            {account.username[0].toUpperCase()}
          </Avatar>
        }
        title={
          <Typography variant="h5">
            {account.username}
          </Typography>
        }
        subheader={`@${account.username}`}
        action={
          isOwnProfile && (
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          )
        }
      />
      <CardContent>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {account.email}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Telefon: {account.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Katılma Tarihi: {new Date(account.createDate).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard; 