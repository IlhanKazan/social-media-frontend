import React, { useState, useCallback } from 'react';
import { Container } from '@mui/material';
import PostList from '../components/post/PostList';

// Global refresh fonksiyonu
let globalRefresh: (() => void) | null = null;

const Home: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  // Global refresh fonksiyonunu güncelle
  React.useEffect(() => {
    globalRefresh = handleRefresh;
    return () => {
      globalRefresh = null;
    };
  }, [handleRefresh]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <PostList key={refreshKey} onRefresh={handleRefresh} />
    </Container>
  );
};

export { globalRefresh };
export default Home; 