import { useQuery } from "@tanstack/react-query";
import { getBlogs, type BlogsResponse } from "#/apis/blogs/blog";

export const useGetBlogs = (page = 1, limit = 12) =>
  useQuery<BlogsResponse, Error>({
    queryKey: ["getBlogs", page, limit],
    queryFn: () => getBlogs(page, limit),
    placeholderData: (prev) => prev,
  });
