import React from 'react';
import { Container } from '@mui/material';
import PostList from '../components/post/PostList';

const Home: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <PostList />
    </Container>
  );
};

export default Home; 