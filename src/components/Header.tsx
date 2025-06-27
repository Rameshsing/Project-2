"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { LogIn } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-2xl font-bold font-headline text-primary">
          EchoSphere
        </Link>
        <nav>
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <Button variant="ghost" asChild className="rounded-full h-10 w-10 p-0">
              <Link href={`/profile/${user.uid}`}>
                <Avatar>
                  <AvatarImage src={`https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg`} alt={user.displayName} data-ai-hint="profile picture"/>
                  <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
