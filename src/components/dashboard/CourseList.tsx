import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Course {
  id: string | number;
  title: string;
  enrollment_count?: number;
  review_count?: number;
}

interface CourseListProps {
  title: string;
  description: string;
  courses: Course[];
  isLoading: boolean;
}

export const CourseList: React.FC<CourseListProps> = ({ 
  title, 
  description, 
  courses, 
  isLoading 
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
          <div className="space-y-2">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.id}`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <div className="text-sm font-medium">{course.title}</div>
                <div className="text-xs text-gray-500">
                  {course.enrollment_count 
                    ? `Enrollments: ${course.enrollment_count}`
                    : `Reviews: ${course.review_count}`}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};