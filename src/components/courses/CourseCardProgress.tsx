// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { Star } from 'lucide-react';
// import { Card, CardContent } from 'src/components/ui/card';
// import { Badge } from 'src/components/ui/badge';
// import { Course } from 'src/types/courses.types';
// import Link from 'next/link';

// export default function CourseCardProgress({ course }: { course: Course }) {
//   const progress = Math.min(100, Math.max(0, course?.modules?.length ?? 0));

//   return (
//     <Link href={`/courses/${course.id}`}>
//       <Card className="rounded-[20px] transition py-5 px-4 gap-0">
//         <div className="relative h-[149px] w-full">
//           <Image
//             src={course.images?.[0] || ''}
//             alt={course.name || ''}
//             width={100}
//             height={149}
//             className="w-full object-cover h-[149px] rounded-[20px]"
//           />
//           {course.rating && (
//             <div className="absolute right-3 bottom-3 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow">
//               <Star
//                 size={14}
//                 className="text-yellow-400 fill-yellow-400 stroke-none"
//               />
//               <span className="text-xs font-medium">{course.rating}</span>
//             </div>
//           )}
//         </div>

//         <CardContent className="pt-4 px-0">
//           <h3 className="text-base font-semibold mb-1 line-clamp-2">
//             {course.title}
//           </h3>
//           <p className="text-xs font-medium text-slate-400 mb-3">
//             {course.started}
//           </p>

//           {/* Progress section (replaces price) */}
//           <div className="mb-3">
//             <div className="flex items-center gap-1 mb-2">
//               <p className="text-sm font-medium text-slate-700">Progress:</p>
//               <p
//                 className={`text-sm font-bold text-slate-700 ${progress === 100 ? 'text-green-500' : ''}`}
//               >
//                 {progress}%{progress === 100 ? ' (Completed)' : ''}
//               </p>
//             </div>

//             <div
//               className="w-full h-2 rounded-full bg-gray-200"
//               role="progressbar"
//               aria-valuenow={progress}
//               aria-valuemin={0}
//               aria-valuemax={100}
//               aria-label={`${course.title} progress`}
//             >
//               <div
//                 className="h-2 rounded-full bg-green-500 transition-all"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//           </div>

//           <p className="text-xs font-medium text-slate-500 mt-3 line-clamp-2">
//             {course.description}
//           </p>

//           <div className="flex gap-2 mt-4 flex-wrap">
//             {course.tags.map((t) => (
//               <Badge
//                 key={t}
//                 className="rounded-full px-3 py-1 text-xs bg-[#E6EFF8]"
//               >
//                 {t}
//               </Badge>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }
