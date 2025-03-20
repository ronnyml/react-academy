import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseListProps } from "@/types/dataTypes";

export const CourseList: React.FC<CourseListProps> = ({
  title,
  description,
  courses,
  isLoading,
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="space-y-2">
                  <div className="text-sm font-medium">{course.title}</div>
                  {course.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-gray-500">
                    {course.enrollment_count && (
                      <span>Enrollments: {course.enrollment_count}</span>
                    )}
                    {course.review_count && (
                      <span>Reviews: {course.review_count}</span>
                    )}
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