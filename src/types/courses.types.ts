export interface Subscription {
  paymentDate?: string;
  length?: number;
  paidAmount?: string | number;
  active?: boolean;
  status?: string;
  plan?: string;
}

export interface Course {
  subscription?: Subscription | Subscription[];
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  images?: string[];
  banner?: string[];
  currency?: string;
  isActive?: boolean;
  level?: string;
  user?: {
    firstName?: string;
    lastName?: string;
  };
  duration?: string;
  rating?: number;
  publishedAt?: Date;
  communityId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  modules?: Module[];
  tags?: string[];
  learningOutcomes?: string[];
  visible?: boolean;
}

export interface Module {
  id?: string;
  name?: string;
  description?: string;
  order?: number;
  duration?: string;
  isActive?: boolean;
  courseId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lessons?: Lesson[];
}

export interface Lesson {
  id?: string;
  name?: string;
  description?: string;
  order?: number;
  duration?: string;
  url?: string;
  content?: string;
  isActive?: boolean;
  moduleId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCourseDto {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  isActive?: boolean;
  level?: string;
  duration?: string;
  rating?: number;
  publishedAt?: Date;
  banner?: import('./uploads.types').FileUploadPayload[];
  images?: import('./uploads.types').FileUploadPayload[];
  tags?: string[];
  learningOutcomes?: string[];
}

export type UpdateCourseDto = CreateCourseDto;

export interface CreateModuleDto {
  name?: string;
  description?: string;
  order?: number;
  duration?: string;
  isActive?: boolean;
}

export type UpdateModuleDto = CreateModuleDto;

export interface CreateLessonDto {
  name?: string;
  description?: string;
  order?: number;
  duration?: string;
  videoFiles?: Array<
    import('./uploads.types').FileUploadPayload | { url: string }
  >;
  content?: string;
  isActive?: boolean;
}

export type UpdateLessonDto = CreateLessonDto;

export interface CoursesQuery {
  isActive?: string;
  level?: string;
}
