import { create } from 'zustand';
import { Course, Module, Lesson } from 'src/types/courses.types';
import { FileUploadPayload } from 'src/types/uploads.types';

interface CourseCreationState {
  // Course data
  courseId: string | null;
  courseData: Partial<Course> | null;

  // Module data
  modules: Module[];
  moduleIds: string[];

  // Lesson data
  lessons: Lesson[];
  lessonIds: string[];

  // Form data for each step
  basicDetails: {
    title: string;
    bio: string;
    description: string;
    difficulty: string;
    duration: string;
    tags: string[];
    learnPoints: string[];
    thumbnail: string;
    banner: string;
    thumbnailData?: FileUploadPayload | null;
    bannerData?: FileUploadPayload | null;
  };

  modulesData: {
    modules: Array<{
      id: string;
      name: string;
      description: string;
      duration: string;
      chapters: Array<{
        id: string;
        name: string;
        media: string[];
        videoEmbedUrl: string;
        savedEmbed: string | null;
        mediaData?: FileUploadPayload[];
      }>;
    }>;
  };

  pricingData: {
    courseType: 'paid' | 'free';
    price: string;
  };

  // Actions
  setCourseId: (courseId: string) => void;
  setCourseData: (courseData: Partial<Course>) => void;
  setModules: (modules: Module[]) => void;
  addModuleId: (moduleId: string) => void;
  setLessons: (lessons: Lesson[]) => void;
  addLessonId: (lessonId: string) => void;

  // Form data actions
  setBasicDetails: (
    details: Partial<CourseCreationState['basicDetails']>,
  ) => void;
  setModulesData: (data: Partial<CourseCreationState['modulesData']>) => void;
  setPricingData: (data: Partial<CourseCreationState['pricingData']>) => void;

  // Reset
  resetCourseCreation: () => void;
}

const initialState = {
  courseId: null,
  courseData: null,
  modules: [],
  moduleIds: [],
  lessons: [],
  lessonIds: [],
  basicDetails: {
    title: '',
    bio: '',
    description: ``,
    difficulty: '',
    duration: '',
    tags: [],
    learnPoints: [],
    thumbnail: '',
    banner: '',
    thumbnailData: null,
    bannerData: null,
  },
  modulesData: {
    modules: [],
  },
  pricingData: {
    courseType: 'paid' as const,
    price: '',
  },
};

export const useCourseCreationStore = create<CourseCreationState>((set) => ({
  ...initialState,

  setCourseId: (courseId: string) => set({ courseId }),
  setCourseData: (courseData: Partial<Course>) => set({ courseData }),
  setModules: (modules: Module[]) => set({ modules }),
  addModuleId: (moduleId: string) =>
    set((state) => ({
      moduleIds: [...state.moduleIds, moduleId],
    })),
  setLessons: (lessons: Lesson[]) => set({ lessons }),
  addLessonId: (lessonId: string) =>
    set((state) => ({
      lessonIds: [...state.lessonIds, lessonId],
    })),

  setBasicDetails: (details) =>
    set((state) => ({
      basicDetails: { ...state.basicDetails, ...details },
    })),
  setModulesData: (data) =>
    set((state) => ({
      modulesData: { ...state.modulesData, ...data },
    })),
  setPricingData: (data) =>
    set((state) => ({
      pricingData: { ...state.pricingData, ...data },
    })),

  resetCourseCreation: () => set(initialState),
}));
