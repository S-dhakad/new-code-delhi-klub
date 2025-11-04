import React from 'react';
import CourseCard from '../common/CourseCard';
import { Course } from 'src/types/courses.types';

interface CoursesProps {
  courses: Course[];
}

const Courses = ({ courses }: CoursesProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-text-secondary">Courses</h2>
        <div className="font-medium text-primary cursor-pointer hover:underline">
          View all
        </div>
      </div>

      <ul className="space-y-2 text-sm font-medium mb-4">
        <li>
          ✅ Easy-to-follow trainings on AI tools, automation, and monetization
        </li>
        <li>✅ Pre-built templates for lead gen, sales, and client delivery</li>
        <li>✅ Weekly coaching calls, Q&A sessions, and real-time feedback</li>
      </ul>

      <div className="grid grid-cols-1 gap-3">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              imageSrc={course.images?.[0] || '/thumbnail.jpg'}
              title={course.name || 'Course'}
              description={course.description || ''}
              tags={course.tags || []}
            />
          ))
        ) : (
          <p className="text-sm text-text-secondary">
            No courses available yet.
          </p>
        )}
      </div>
    </section>
  );
};

export default Courses;
