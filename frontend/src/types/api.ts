import { Task } from './task';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export type TaskListResponse = PaginatedResponse<Task>;
export type TaskResponse = ApiResponse<Task>;
