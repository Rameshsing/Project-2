"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import type { Post, UserProfile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { UserPlus, UserCheck } from "lucide-react";

const mockUsers: Record<string, UserProfile> = {
    'user-2': { id: 'user-2', name: 'Jane Doe', avatarUrl: 'https://placehold.co/128x128.png', followers: 125, following: 88, bio: 'Lover of coffee and code. ☕' },
    'user-3': { id: 'user-3', name: 'John Smith', avatarUrl: 'https://placehold.co/128x128.png', followers: 230, following: 150, bio: 'Building things for the web.' },
    '12345': { id: '12345', name: 'Current User', avatarUrl: 'https://placehold.co/128x128.png', followers: 50, following: 42, bio: 'Just me.' }
};

const mockPostsByUser: Record<string, Post[]> = {
    'user-2': [{
        id: 'post-1',
        author: { id: 'user-2', name: 'Jane Doe', avatarUrl: 'https://placehold.co/40x40.png' },
        content: 'Just enjoying a beautiful day! ☀️ #blessed',
        likes: 12,
        comments: 3,
        createdAt: '2 hours ago',
        isLiked: false,
    }],
    'user-3': [{
        id: 'post-2',
        author: { id: 'user-3', name: 'John Smith', avatarUrl: 'https://placehold.co/40x40.png' },
        content: 'Thinking about building a new side project in Next.js. Any ideas?',
        likes: 45,
        comments: 12,
        createdAt: '5 hours ago',
        isLiked: true,
    }],
    '12345': []
}


export default function ProfilePage({ params }: { params: { userId: string } }) {
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const profile = mockUsers[params.userId];
      const userPosts = mockPostsByUser[params.userId] || [];
      setUserProfile(profile);
      setPosts(userPosts);
      setLoading(false);
      setIsFollowing(params.userId !== currentUser?.uid && Math.random() > 0.5);
    }, 1000);
    return () => clearTimeout(timer);
  }, [params.userId, currentUser?.uid]);

  const handleFollowToggle = () => {
      setIsFollowing(prev => !prev);
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-8 px-4">
        <Card className="mb-8 p-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </Card>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center py-10">User not found.</div>;
  }

  const isOwnProfile = currentUser?.uid === userProfile.id;

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Card className="mb-8 overflow-hidden">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-primary">
              <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} data-ai-hint="profile avatar" />
              <AvatarFallback className="text-4xl">{userProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold font-headline">{userProfile.name}</h1>
                {!isOwnProfile && (
                    <Button onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'default'}>
                        {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                )}
              </div>
              <div className="flex justify-center sm:justify-start gap-6 my-4">
                <div className="text-center">
                  <p className="font-bold text-lg">{posts.length}</p>
                  <p className="text-sm text-muted-foreground">Posts</p>
                </div>
                 <div className="text-center">
                  <p className="font-bold text-lg">{userProfile.followers}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                 <div className="text-center">
                  <p className="font-bold text-lg">{userProfile.following}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
              </div>
              <p>{userProfile.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold font-headline mb-4">Posts</h2>
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center text-muted-foreground py-10 bg-card rounded-lg">
            <p>{isOwnProfile ? "You haven't posted anything yet." : "This user hasn't posted anything yet."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
