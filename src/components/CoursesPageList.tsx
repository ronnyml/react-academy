import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CoursesPageListProps } from "@/types/dataTypes";
import { Calendar, ChevronRight, Star } from "lucide-react";

export const CoursesPageList: React.FC<CoursesPageListProps> = ({
  courses,
  isLoading,
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg animate-pulse">
            <div className="text-gray-400">Loading courses...</div>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg">
            <div className="text-gray-500 font-medium">No courses found.</div>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="group flex flex-col h-full overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="h-2 bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/70"></div>
                <div className="flex flex-col flex-grow p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-lg line-clamp-2 group-hover:text-[#1E3A8A] transition-colors">
                      {course.title}
                    </div>
                    {course.isFeatured && (
                      <Badge variant="outline" className="ml-2 bg-amber-50 border-amber-200 text-amber-600 flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-grow">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(course.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center text-[#1E3A8A] text-xs font-medium">
                      <span>View course</span>
                      <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};