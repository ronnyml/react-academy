import React, { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import BaseLayout from "@/layouts/BaseLayout";
import { courseService } from "@/services/courseService";
import { CoursesPageList } from "@/components/CoursesPageList";
import ErrorScreen from "@/components/ErrorScreen";
import LoadingSpinner from "@/components/LoadingSpinner";
import { PaginationComponent } from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, PaginatedCourses } from "@/types/dataTypes";
import { usePagination } from "@/hooks/usePagination";
import { useSearch } from "@/hooks/useSearch";
import { useFilter } from "@/hooks/useFilter";
import { useLoadingState } from "@/hooks/useLoadingState";
import { useTranslator } from "@/hooks/useTranslator";

const COURSES_PER_PAGE = 20;

const CoursesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslator();
  const { 
    currentPage, 
    isPageChanging, 
    handlePageChange 
  } = usePagination();
  
  const {
    searchTerm,
    searchQuery,
    setSearchTerm,
    handleSearch,
    handleKeyDown,
    clearSearch
  } = useSearch();
  
  const {
    selectedFilter: selectedCategory,
    handleFilterChange: handleCategoryChange,
    clearFilter: clearCategory
  } = useFilter<string>();

  const categoriesQueryKey = useMemo(() => ["categories"], []);
  const coursesQueryKey = useMemo(
    () => ["courses", selectedCategory, currentPage, COURSES_PER_PAGE, searchQuery],
    [selectedCategory, currentPage, searchQuery]
  );

  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: categoriesQueryKey,
    queryFn: () => courseService.getCategories(),
  });

  const {
    data: coursesResponse,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    isFetching,
  } = useQuery<PaginatedCourses>({
    queryKey: coursesQueryKey,
    queryFn: () =>
      courseService.getCourses(
        selectedCategory ? Number(selectedCategory) : undefined,
        currentPage,
        COURSES_PER_PAGE,
        searchQuery
      ),
  });

  const { isLoading: isLoadingState } = useLoadingState({
    isFetching,
    isPageChanging
  });

  const prefetchAdjacentPages = useCallback(() => {
    if (coursesResponse && currentPage < coursesResponse.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["courses", selectedCategory, currentPage + 1, COURSES_PER_PAGE, searchQuery],
        queryFn: () =>
          courseService.getCourses(
            selectedCategory ? Number(selectedCategory) : undefined,
            currentPage + 1,
            COURSES_PER_PAGE,
            searchQuery
          ),
      });
    }

    if (currentPage > 1) {
      queryClient.prefetchQuery({
        queryKey: ["courses", selectedCategory, currentPage - 1, COURSES_PER_PAGE, searchQuery],
        queryFn: () =>
          courseService.getCourses(
            selectedCategory ? Number(selectedCategory) : undefined,
            currentPage - 1,
            COURSES_PER_PAGE,
            searchQuery
          ),
      });
    }
  }, [currentPage, selectedCategory, searchQuery, queryClient, coursesResponse]);

  React.useEffect(() => {
    prefetchAdjacentPages();
  }, [prefetchAdjacentPages]);

  const hasActiveFilters = useMemo(
    () => selectedCategory !== null || searchQuery !== "",
    [selectedCategory, searchQuery]
  );
  
  const clearAllFilters = useCallback(() => {
    clearSearch();
    clearCategory();
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  }, [clearSearch, clearCategory, currentPage, handlePageChange]);

  const { coursesData, totalPages, totalCourses, showPagination, isInitialLoading } = useMemo(() => ({
    coursesData: coursesResponse?.courses || [],
    totalPages: coursesResponse?.totalPages || 1,
    totalCourses: coursesResponse?.totalCourses || 0,
    showPagination: (coursesResponse?.totalPages || 1) > 1,
    isInitialLoading: isCoursesLoading || isCategoriesLoading
  }), [coursesResponse, isCoursesLoading, isCategoriesLoading]);

  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory) return null;
    return categoriesData.find((cat) => cat.id === Number(selectedCategory))?.name;
  }, [selectedCategory, categoriesData]);

  const { headerTitle, headerSubtitle } = useMemo(() => {
    let title = t("courses.allCourses");
    let subtitle = t("courses.subtitle");
    
    if (selectedCategoryName) {
      title = selectedCategoryName;
      subtitle = `${t("courses.browse")} ${selectedCategoryName} ${t("courses.label")}`;
    } else if (searchQuery) {
      title = `${t("courses.searchResults")} "${searchQuery}"`;
      subtitle = `${t("courses.showingCourses")} "${searchQuery}"`;
    }
    
    return { headerTitle: title, headerSubtitle: subtitle };
  }, [selectedCategoryName, searchQuery, t]);

  if (isInitialLoading) {
    return <LoadingSpinner />;
  }

  if (isCoursesError || isCategoriesError) {
    return <ErrorScreen title={t("courses.title")} />;
  }

  return (
    <BaseLayout>
      <div className="from-primary/10 via-primary/5 to-transparent">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <SearchFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
            handleKeyDown={handleKeyDown}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            categoriesData={categoriesData}
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
          />

          {isLoadingState && <LoadingSpinner />}

          <div className="mb-8">
            <CourseHeader 
              title={headerTitle}
              subtitle={headerSubtitle}
              totalCourses={totalCourses}
            />

            {isLoadingState ? (
              <CourseSkeletons count={6} />
            ) : (
              <CoursesPageList
                courses={coursesData}
                isLoading={false}
                totalCourses={totalCourses}
              />
            )}
          </div>

          {showPagination && (
            <div className="flex justify-center">
              <PaginationComponent
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
};

interface CourseSkeletonsProps {
  count: number;
}

const CourseSkeletons: React.FC<CourseSkeletonsProps> = ({ count }) => (
  <div className="mt-6 mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  selectedCategory: string | null;
  handleCategoryChange: (value: string) => void;
  categoriesData: Category[];
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  handleKeyDown, 
  selectedCategory, 
  handleCategoryChange, 
  categoriesData, 
  hasActiveFilters, 
  clearAllFilters 
}) => {
  const { t } = useTranslator();
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 flex">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("courses.searchCourses")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-10 border-gray-200 focus-visible:ring-[#1E3A8A]/40"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            onClick={handleSearch}
            className="ml-2 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
          >
            {t("search")}
          </Button>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedCategory || ""}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-full md:w-[200px] border-gray-200">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <SelectValue placeholder={t("courses.allCategories")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("courses.allCategories")}</SelectItem>
              {categoriesData.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="border-gray-200">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="border-gray-200 text-gray-700 hover:text-[#1E3A8A] hover:border-[#1E3A8A]/30"
            >
              <X className="h-4 w-4 mr-2" />
              <span>{t("courses.clearAll")}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
};

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  totalCourses: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, subtitle, totalCourses }) => {
  const { t } = useTranslator();
  return (
    <div className="bg-[#1E3A8A] text-white p-6 rounded-xl w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-white/80">{subtitle}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <span className="font-medium">{totalCourses} {t("courses.totalCourses")}</span>
        </div>
      </div>
    </div>
  )
};

export default React.memo(CoursesPage);