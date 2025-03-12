import { useState } from 'react';

interface UseSearchProps {
  onSearch?: (query: string) => void;
}

interface UseSearchReturn {
  searchTerm: string;
  searchQuery: string;
  setSearchTerm: (term: string) => void;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
}

export const useSearch = ({ onSearch }: UseSearchProps = {}): UseSearchReturn => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    if (onSearch) onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchQuery('');
  };

  return {
    searchTerm,
    searchQuery,
    setSearchTerm,
    setSearchQuery,
    handleSearch,
    handleKeyDown,
    clearSearch
  };
};