import type { ReactionType as PrismaReactionType } from "@prisma/client";

export type ReactionType = PrismaReactionType;

export interface User {
  id?: string;
  name: string | null;
  email?: string | null;
  image: string | null;
}

export interface Site {
  id?: string;
  name: string;
  subdomain: string;
  user: User;
}

export interface Comment {
  id: string;
}

export interface Reaction {
  type: ReactionType;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string | Date; // Allow both string and Date
  site: Site;
  comments: Comment[];
  reactions: Reaction[];
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  totalPosts: number;
}
