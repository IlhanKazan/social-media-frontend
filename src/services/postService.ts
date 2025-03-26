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
    context: content || (type === 1 ? 'like' : type === 2 ? 'dislike' : '')
  });
  return response.data;
};

export const deleteInteraction = async (interactionId: number) => {
  const response = await api.get(`/interaction/delete/${interactionId}`);
  return response.data;
};

export const deletePost = async (postId: number) => {
  const response = await api.get(`/post/delete/${postId}`);
  return response.data;
};

export const updatePost = async (postId: number, context: string) => {
  const response = await api.post('/post/update', {
    postId,
    context
  });
  return response.data;
};

export const getPost = async (postId: number) => {
  const response = await api.get(`/post/${postId}`);
  return response.data;
}; 