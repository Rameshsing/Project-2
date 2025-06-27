"use client";

import { useState, useEffect } from "react";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for initial display
const mockPosts: Post[] = [
  {
    id: 'post-1',
    author: { id: 'user-2', name: 'Jane Doe', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg' },
    content: 'Just enjoying a beautiful day! ☀️ #blessed',
    likes: 12,
    comments: 3,
    createdAt: '2 hours ago',
    isLiked: false,
  },
  {
    id: 'post-2',
    author: { id: 'user-3', name: 'John Smith', avatarUrl: 'https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg' },
    content: 'Thinking about building a new side project in Next.js. Any ideas?',
    likes: 45,
    comments: 12,
    createdAt: '5 hours ago',
    isLiked: true,
  },
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="space-y-8">
        <CreatePostForm onPostCreated={handlePostCreated} />
        
        <div className="space-y-4">
          {loading ? (
            <>
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-48 w-full rounded-lg" />
            </>
          ) : posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>No posts yet.</p>
                <p>Follow users to see their posts here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
