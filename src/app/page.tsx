"use client";

import { useState, useEffect } from "react";
import { CreatePostForm } from "@/components/CreatePostForm";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish before fetching

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isLiked: user ? data.likedBy?.includes(user.uid) : false,
        } as Post;
      });
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="space-y-8">
        <CreatePostForm />
        
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
                <p>Be the first to post something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
