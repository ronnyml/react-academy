import { useState, useEffect } from 'react';

interface UseLoadingStateProps {
  isFetching: boolean;
  isPageChanging?: boolean;
  delay?: number;
}

export const useLoadingState = ({
  isFetching,
  isPageChanging = false,
  delay = 300
}: UseLoadingStateProps) => {
  const [isLoading, setIsLoading] = useState(isPageChanging);

  useEffect(() => {
    if (isFetching) {
      setIsLoading(true);
    } else if (!isFetching && isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isFetching, isLoading, delay]);

  return {
    isLoading
  };
};