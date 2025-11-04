import axiosInstance from '../axios';
import {
  Course,
  Module,
  Lesson,
  CreateCourseDto,
  UpdateCourseDto,
  CreateModuleDto,
  UpdateModuleDto,
  CreateLessonDto,
  UpdateLessonDto,
  CoursesQuery,
} from '../../types/courses.types';

export const coursesService = {
  // Course APIs
  async createCourse(communityId: string, data: CreateCourseDto) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/courses`,
      data,
    );
    return response.data;
  },

  async getCourses(communityId: string, query?: CoursesQuery) {
    const params = new URLSearchParams();

    if (query?.isActive) params.append('isActive', query.isActive);
    if (query?.level) params.append('level', query.level);

    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses?${params.toString()}`,
    );
    return response.data;
  },

  async getAllCourse(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses`,
    );
    return response.data;
  },

  async getMyCourses(communityId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/me`,
    );
    return response.data;
  },

  async getDashboardCourses(communityId: string, courseId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}/dashboard/community-course-purchased-list`,
    );
    return response.data;
  },

  async getCourseById(communityId: string, courseId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}`,
    );
    return response.data;
  },

  async updateCourse(
    communityId: string,
    courseId: string,
    data: UpdateCourseDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/courses/${courseId}`,
      data,
    );
    return response.data;
  },

  async deleteCourse(communityId: string, courseId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/courses/${courseId}`,
    );
    return response.data;
  },

  // Module APIs
  async createModule(
    communityId: string,
    courseId: string,
    data: CreateModuleDto,
  ) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/courses/${courseId}/modules`,
      data,
    );
    return response.data;
  },

  async getModules(communityId: string, courseId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}/modules`,
    );
    return response.data;
  },

  async getModuleById(communityId: string, courseId: string, moduleId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}`,
    );
    return response.data;
  },

  async updateModule(
    communityId: string,
    courseId: string,
    moduleId: string,
    data: UpdateModuleDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}`,
      data,
    );
    return response.data;
  },

  async deleteModule(communityId: string, courseId: string, moduleId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}`,
    );
    return response.data;
  },

  // Lesson APIs
  async createLesson(
    communityId: string,
    courseId: string,
    moduleId: string,
    data: CreateLessonDto,
  ) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons`,
      data,
    );
    return response.data;
  },

  async getLessons(communityId: string, courseId: string, moduleId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons`,
    );
    return response.data;
  },

  async getLessonById(
    communityId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
  ) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    );
    return response.data;
  },

  async updateLesson(
    communityId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: UpdateLessonDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      data,
    );
    return response.data;
  },

  async deleteLesson(
    communityId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
  ) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
    );
    return response.data;
  },

  async updateLessonProgress(
    communityId: string,
    courseId: string,
    moduleId: string,
    lessonId: string,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/progress/complete`,
    );
    return response.data;
  },
};
