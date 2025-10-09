import { User } from './user';
import { Ward } from './ward';
import { Category } from './category';

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  mainImage?: string;
  images?: string[];
  authorId: User | string; // It can be populated or just the id
  ward: Ward | string; // It can be populated or just the id
  createdAt: string;
  totalLikes: number;
  viewCount: number;
  shareCount: number;
  commentsCount?: number;
  privacy: 'public' | 'private';
  status: string;
  tags: string[]; // Assuming tags are just strings
  categories: (Category | string)[]; // Can be populated or just ids
}