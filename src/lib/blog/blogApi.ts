// src/lib/blog/blogApi.ts
import axios from "axios";
import axiosInstance from "../axiosInstance";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// 1. (Giả định) Định nghĩa kiểu Blog (Bạn nên thay bằng kiểu Blog thật)
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: any; // Thay bằng type User
  createdAt: string;
  // ... thêm các trường khác của Blog
}

// 2. (Giả định) Định nghĩa kiểu Response cho danh sách Blogs
export interface BlogsResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 3. Sửa lại: Không export 'blogApi' nữa, mà export trực tiếp
//    (Hoặc vẫn giữ 'blogApi' và sửa file 'useBlogs.ts' - Cả 2 cách đều được)
//    Cách 1: Export trực tiếp (dễ cho react-query)

// Lấy danh sách blog (có phân trang + lọc theo query)
export const getBlogs = async (query?: Record<string, any>): Promise<BlogsResponse> => { //không token
  const res = await axios.get(`${API_URL}/blogs`, {
    params: query
  });
  return res.data; // Giả định res.data có dạng BlogsResponse
};

// Lấy chi tiết blog theo id
export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await axios.get(`${API_URL}/blogs/${id}`);
  return res.data.data;
};

// Lấy chi tiết blog theo slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const res = await axios.get(`${API_URL}/blogs/slug/${slug}`);
  return res.data.data;
};

// Tạo blog mới
export const createBlog = async (formData: FormData) => {
  const res = await axiosInstance.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// Cập nhật blog
export const updateBlog = async (id: string, formData: FormData) => {
  const res = await axiosInstance.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// Xóa blog
export const deleteBlog = async (id: string) => {
  const res = await axiosInstance.delete(`/blogs/${id}`);
  return res.data;
};

// Like hoặc bỏ like blog
export const likeBlog = async (id: string) => {
  const res = await axiosInstance.patch(`/blogs/${id}/like`);
  return res.data.data;
};

// Chia sẻ blog
export const shareBlog = async (id: string) => {
  const res = await axiosInstance.post(`/blogs/${id}/share`);
  return res.data;
};

// Cập nhật quyền riêng tư blog
export const updateBlogPrivacy = async (id: string, privacy: "public" | "private") => {
  const res = await axiosInstance.patch(`/blogs/${id}/privacy`, { privacy });
  return res.data;
};

// Cập nhật trạng thái blog (vd: draft/published)
export const updateBlogStatus = async (id: string, status: string) => {
  const res = await axiosInstance.patch(`/blogs/${id}/status`, { status });
  return res.data;
};

// Lấy danh sách blog theo tác giả
export const getBlogsByAuthor = async (authorId: string) => {
  const res = await axiosInstance.get(`/blogs/author/${authorId}`);
  return res.data;
};

