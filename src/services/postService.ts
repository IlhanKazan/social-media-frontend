import api from './api';
import { Post } from '../types/post';

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get<Post[]>('/post/get-all');
  return response.data;
};

export const createPost = async (context: string): Promise<Post> => {
  const response = await api.post<Post>('/post/save', { context });
  return response.data;
};

export const getPostById = async (id: number): Promise<Post> => {
  const response = await api.get<Post>(`/post/get-by-id/${id}`);
  return response.data;
};

export const saveInteraction = async (postId: number, type: number, content?: string) => {
  const response = await api.post('/interaction/save', {
    postId,
    type,
    content: content || null
  });
  return response.data;
}; 