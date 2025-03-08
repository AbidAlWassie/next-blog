import type { PostsResponse } from "@/types/post";
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// Define the query function without using QueryFunctionContext
const fetchPosts = async ({ pageParam = 1 }: { pageParam?: unknown }) => {
  const { data } = await axios.get<PostsResponse>(
    `/api/posts?page=${pageParam}&limit=10`
  );
  return data;
};

interface UseInfinitePostsOptions
  extends Partial<
    UseInfiniteQueryOptions<PostsResponse, Error, InfiniteData<PostsResponse>>
  > {
  initialData?: InfiniteData<PostsResponse>;
}

export function useInfinitePosts(options: UseInfinitePostsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.posts.length / 10 + 1 : undefined;
    },
    initialPageParam: 1,
    ...options,
  });
}
