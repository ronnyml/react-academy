import { useState, useEffect } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  onPageChange?: () => void;
}

interface UsePaginationReturn {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  isPageChanging: boolean;
  handlePageChange: (page: number) => void;
}

export const usePagination = ({
  initialPage = 1,
  onPageChange
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isPageChanging, setIsPageChanging] = useState(false);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsPageChanging(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onPageChange) onPageChange();
  };

  useEffect(() => {
    if (isPageChanging) {
      const timer = setTimeout(() => {
        setIsPageChanging(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPageChanging]);

  return {
    currentPage,
    setCurrentPage,
    isPageChanging,
    handlePageChange
  };
};