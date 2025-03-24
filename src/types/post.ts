export interface Post {
  postId: number;
  accountId: number;
  accountUsername: string;
  context: string;
  createDate: string;
  updateDate: string;
  status: number;
  interactions: Interaction[];
}

export interface Interaction {
  interactionId: number;
  postId: number;
  accountId: number;
  accountUsername: string;
  context: string;
  type: number;
  status: number;
  createDate: string;
  updateDate: string | null;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
} 