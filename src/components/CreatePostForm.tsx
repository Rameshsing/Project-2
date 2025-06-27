"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moderateContent } from "@/ai/flows/moderate-content";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Post } from "@/types";

const FormSchema = z.object({
  content: z.string().min(1, "Post cannot be empty.").max(280, "Post cannot exceed 280 characters."),
});

interface CreatePostFormProps {
    onPostCreated: (post: Post) => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not authenticated",
            description: "You must be logged in to create a post.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
      const moderationResult = await moderateContent({ text: data.content });
      if (moderationResult.isHarmful) {
        toast({
          variant: "destructive",
          title: "Inappropriate Content Detected",
          description: `Reason: ${moderationResult.reason}. Please revise your post.`,
        });
        return;
      }

      const newPost: Post = {
        id: new Date().toISOString(),
        author: {
          id: user.uid,
          name: user.displayName,
          avatarUrl: `https://static.vecteezy.com/system/resources/previews/018/765/757/non_2x/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg`,
        },
        content: data.content,
        likes: 0,
        comments: 0,
        createdAt: "Just now",
        isLiked: false,
      };
      
      onPostCreated(newPost);
      toast({
        title: "Post created!",
        description: "Your post is now live.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts with the sphere..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
