export interface BlogComment {
  _id: string;
  blogId: string;
  comment: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  images?: string[];
  likeBy: string[];
  totalLikes: number;
  createdAt: string;
}
