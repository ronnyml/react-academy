import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoursesPageListProps } from "@/types/dataTypes";

export const CoursesPageList: React.FC<CoursesPageListProps> = ({
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
          <div>Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-gray-500">No courses found.</div>
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
                  <div className="text-xs text-gray-500">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
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