export interface Account {
  accountId: number;
  username: string;
  email: string;
  phone: string;
  status: number;
  createDate: string;
  updateDate: string | null;
  posts: Post[];
  interactions: Interaction[];
}

export interface Post {
  postId: number;
  accountId: number;
  accountUsername: string;
  context: string;
  createDate: string;
  updateDate: string | null;
  status: number;
  interactions: Interaction[];
}

export interface Interaction {
  createDate: string;
  updateDate: string | null;
  interactionId: number;
  postId: number;
  accountId: number;
  type: number;
  status: number;
  accountUsername: string;
  context?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
} 