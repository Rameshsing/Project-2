
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/PostCard";
import type { Post, UserProfile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, collection, query, where, orderBy, writeBatch, increment, onSnapshot } from "firebase/firestore";

export default function ProfilePage() {
  const params = useParams<{ userId: string }>();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    if (!params.userId) {
        setLoading(false);
        return;
    };

    setLoading(true);

    // Listener for User Profile
    const userDocRef = doc(db, "users", params.userId);
    const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserProfile({
          id: doc.id,
          name: data.name ?? 'Unnamed User',
          email: data.email ?? '',
          avatarUrl: data.avatarUrl ?? '',
          bio: data.bio ?? 'No bio yet.',
          followers: data.followers ?? 0,
          following: data.following ?? 0,
        });
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Listener for Posts
    const postsQuery = query(collection(db, "posts"), where("author.id", "==", params.userId), orderBy("createdAt", "desc"));
    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const userPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isLiked: currentUser ? doc.data().likedBy?.includes(currentUser.uid) : false,
      } as Post));
      setPosts(userPosts);
    });

    // Listener for Following Status
    let unsubscribeFollowing = () => {};
    if (currentUser && currentUser.uid !== params.userId) {
        const followingDocRef = doc(db, "users", currentUser.uid, "following", params.userId);
        unsubscribeFollowing = onSnapshot(followingDocRef, (doc) => {
            setIsFollowing(doc.exists());
        });
    }

    return () => {
      unsubscribeUser();
      unsubscribePosts();
      unsubscribeFollowing();
    };
  }, [params.userId, currentUser]);


  const handleFollowToggle = async () => {
    if (!currentUser || isFollowLoading || !params.userId || currentUser.uid === params.userId) return;
    setIsFollowLoading(true);

    const currentUserRef = doc(db, "users", currentUser.uid);
    const profileUserRef = doc(db, "users", params.userId);

    const followingRef = doc(db, "users", currentUser.uid, "following", params.userId);
    const followerRef = doc(db, "users", params.userId, "followers", currentUser.uid);

    try {
        const batch = writeBatch(db);

        if (isFollowing) {
            batch.delete(followingRef);
            batch.delete(followerRef);
            batch.update(currentUserRef, { following: increment(-1) });
            batch.update(profileUserRef, { followers: increment(-1) });
        } else {
            batch.set(followingRef, { userId: params.userId, createdAt: new Date().toISOString() });
            batch.set(followerRef, { userId: currentUser.uid, createdAt: new Date().toISOString() });
            batch.update(currentUserRef, { following: increment(1) });
            batch.update(profileUserRef, { followers: increment(1) });
        }
        
        await batch.commit();

    } catch (error) {
        console.error("Failed to follow/unfollow:", error);
    } finally {
        setIsFollowLoading(false);
    }
  };

  if (loading || authLoading) {
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
                {!isOwnProfile && currentUser && (
                    <Button onClick={handleFollowToggle} variant={isFollowing ? 'secondary' : 'default'} disabled={isFollowLoading}>
                        {isFollowLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : (isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />)}
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
