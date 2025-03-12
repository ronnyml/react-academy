import { useState } from 'react';

interface UseFilterProps<T> {
  initialValue?: T | null;
  onFilterChange?: (value: T | null) => void;
}

interface UseFilterReturn<T> {
  selectedFilter: T | null;
  setSelectedFilter: (value: T | null) => void;
  handleFilterChange: (value: string) => void;
  clearFilter: () => void;
}

export const useFilter = <T extends string | number>({
  initialValue = null,
  onFilterChange
}: UseFilterProps<T> = {}): UseFilterReturn<T> => {
  const [selectedFilter, setSelectedFilter] = useState<T | null>(initialValue);

  const handleFilterChange = (value: string) => {
    const newValue = value === 'all' ? null : value as unknown as T;
    setSelectedFilter(newValue);
    if (onFilterChange) onFilterChange(newValue);
  };

  const clearFilter = () => {
    setSelectedFilter(null);
    if (onFilterChange) onFilterChange(null);
  };

  return {
    selectedFilter,
    setSelectedFilter,
    handleFilterChange,
    clearFilter
  };
};