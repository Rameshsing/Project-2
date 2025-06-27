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
  createdAt: string;
  isLiked: boolean;
};

export type UserProfile = {
    id: string;
    name: string;
    avatarUrl: string;
    followers: number;
    following: number;
    bio: string;
}
