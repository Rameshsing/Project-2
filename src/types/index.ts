export type PostAuthor = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Post = {
  id: string;
  author: PostAuthor;
  content: string;
  likes: number;
  comments: number;
  createdAt: string; // ISO string
  isLiked: boolean; // This is client-side state, derived from likedBy
  likedBy: string[]; // Array of user UIDs
};

export type Comment = {
    id: string;
    text: string;
    author: PostAuthor;
    createdAt: string; // ISO String
}

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    followers: number;
    following: number;
    bio: string;
}
