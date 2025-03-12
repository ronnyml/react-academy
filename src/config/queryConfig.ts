import { QueryClient, DefaultOptions } from "@tanstack/react-query";

export const CACHE_TIME = 1000 * 60 * 10; // 10 minutes
export const STALE_TIME = 1000 * 60 * 5; // 5 minutes

interface QueryOptions<TData = unknown> extends DefaultOptions {
  queries: {
    staleTime: number;
    gcTime: number;
    refetchOnWindowFocus: boolean;
    placeholderData: (previousData: TData | undefined) => TData | undefined;
  };
}

const defaultOptions: QueryOptions = {
  queries: {
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  },
};

export const queryClient = new QueryClient({
  defaultOptions,
});
