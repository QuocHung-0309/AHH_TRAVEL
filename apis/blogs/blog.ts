
import axios from "#/apis/api-constant";

export type Blog = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  featured?: boolean;
  createdAt?: string;
};

export type BlogsResponse = {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
};

export const getBlogs = async (page = 1, limit = 12): Promise<BlogsResponse> => {
  const res = await axios.get<BlogsResponse>("/api/blogs", { params: { page, limit } });
  return res.data;
};
