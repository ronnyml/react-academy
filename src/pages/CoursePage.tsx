import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import BaseLayout from "@/layouts/BaseLayout";
import { courseService } from "@/services/courseService";
import { CoursesPageList } from "@/components/CoursesPageList";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, PaginatedCourses } from "@/types/dataTypes";

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: categoriesData = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
  });

  const {
    data: coursesResponse,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useQuery<PaginatedCourses>({
    queryKey: ["courses", selectedCategory],
    queryFn: () =>
      courseService.getCourses(
        selectedCategory ? Number(selectedCategory) : undefined
      ),
  });

  const coursesData = coursesResponse?.courses || [];
  const filteredCourses = coursesData.filter((course) => {
    const search = searchTerm.toLowerCase();
    const nameMatch = course.title.toLowerCase().includes(search);
    const descriptionMatch = course.description
      ? course.description.toLowerCase().includes(search)
      : false;
    return nameMatch || descriptionMatch;
  });

  if (isCoursesLoading || isCategoriesLoading) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Courses</h1>
          <p>Loading courses data...</p>
        </div>
      </BaseLayout>
    );
  }

  if (isCoursesError || isCategoriesError) {
    return (
      <BaseLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Courses</h1>
          <p className="text-red-500">
            Error loading courses data. Please try again later.
          </p>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Courses</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            value={selectedCategory || ""}
            onValueChange={(value) =>
              setSelectedCategory(value === "all" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categoriesData.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <CoursesPageList
          title="Courses"
          description={
            selectedCategory
              ? `${
                  categoriesData.find(
                    (cat) => cat.id === Number(selectedCategory)
                  )?.name
                }`
              : "All available courses"
          }
          courses={filteredCourses}
          isLoading={isCoursesLoading}
        />
      </div>
    </BaseLayout>
  );
};

export default CoursesPage;