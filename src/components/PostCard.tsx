"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Post, Comment } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, arrayUnion, arrayRemove, collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatDistanceToNowStrict } from 'date-fns';
import { Skeleton } from './ui/skeleton';

const CommentFormSchema = z.object({
  text: z.string().min(1, "Comment cannot be empty.").max(200, "Comment is too long."),
});

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const handleLike = async () => {
        if (!user) {
            toast({ variant: "destructive", title: "You must be logged in to like a post." });
            return;
        }
        if (isLiking) return;

        setIsLiking(true);
        const postRef = doc(db, "posts", post.id);

        try {
            if (post.isLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error liking post:", error);
            toast({ variant: "destructive", title: "Something went wrong." });
        } finally {
            setIsLiking(false);
        }
    };

    useEffect(() => {
        if (showComments) {
            setCommentsLoading(true);
            const commentsQuery = query(collection(db, "posts", post.id, "comments"), orderBy("createdAt", "asc"));
            const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
                const fetchedComments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
                setComments(fetchedComments);
                setCommentsLoading(false);
            });
            return () => unsubscribe();
        }
    }, [showComments, post.id]);

    const commentForm = useForm<z.infer<typeof CommentFormSchema>>({
      resolver: zodResolver(CommentFormSchema),
      defaultValues: { text: "" },
    });

    async function onCommentSubmit(data: z.infer<typeof CommentFormSchema>) {
        if (!user || !user.displayName) {
            toast({ variant: "destructive", title: "You must be logged in to comment." });
            return;
        }
        const postRef = doc(db, "posts", post.id);
        const commentsColRef = collection(postRef, "comments");

        try {
            await addDoc(commentsColRef, {
                text: data.text,
                author: {
                    id: user.uid,
                    name: user.displayName,
                    avatarUrl: user.photoURL ?? `https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg`,
                },
                createdAt: new Date().toISOString(),
            });
            await updateDoc(postRef, { comments: increment(1) });
            commentForm.reset();
        } catch (error) {
            console.error("Error adding comment:", error);
            toast({ variant: "destructive", title: "Could not add comment." });
        }
    }
    
    const createdAtDate = post.createdAt ? new Date(post.createdAt) : new Date();
    const timeAgo = formatDistanceToNowStrict(createdAtDate, { addSuffix: true });

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
            <p className="text-sm text-muted-foreground">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-2 pb-2">
        <Button variant="ghost" size="sm" onClick={handleLike} disabled={isLiking} className="flex items-center gap-2">
          <Heart className={cn("h-5 w-5", post.isLiked && "fill-destructive text-destructive")} />
          <span>{post.likes}</span>
          <span className="sr-only">Likes</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span>{post.comments}</span>
           <span className="sr-only">Comments</span>
        </Button>
      </CardFooter>
      {showComments && (
        <div className="border-t p-4 pt-4">
            {user && (
                 <Form {...commentForm}>
                    <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="flex items-start gap-2 mb-4">
                        <FormField
                        control={commentForm.control}
                        name="text"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormControl>
                                <Textarea placeholder="Add a comment..." className="resize-none" rows={1} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" size="icon" disabled={commentForm.formState.isSubmitting}>
                           {commentForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </Form>
            )}
            <div className="space-y-4">
                {commentsLoading && <Skeleton className="h-10 w-full" />}
                {!commentsLoading && comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
                {!commentsLoading && comments.map(comment => (
                    <div key={comment.id} className="flex items-start gap-2 text-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p>
                                <Link href={`/profile/${comment.author.id}`} className="font-semibold hover:underline">{comment.author.name}</Link>
                                <span className="ml-2 text-muted-foreground text-xs">{formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}</span>
                            </p>
                            <p className="whitespace-pre-wrap">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </Card>
  );
}
