"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post: initialPost }: PostCardProps) {
    const [post, setPost] = useState(initialPost);
    
    const handleLike = () => {
        setPost(prevPost => ({
            ...prevPost,
            isLiked: !prevPost.isLiked,
            likes: prevPost.isLiked ? prevPost.likes - 1 : prevPost.likes + 1,
        }));
    };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Link href={`/profile/${post.author.id}`}>
            <Avatar>
            <AvatarImage src={post.author.avatarUrl} alt={post.author.name} data-ai-hint="profile picture" />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
        </Link>
        <div className="flex flex-col">
            <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
                {post.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">{post.createdAt}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-4">
        <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-2">
          <Heart className={cn("h-5 w-5", post.isLiked && "fill-destructive text-destructive")} />
          <span>{post.likes}</span>
          <span className="sr-only">Likes</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments}</span>
           <span className="sr-only">Comments</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
