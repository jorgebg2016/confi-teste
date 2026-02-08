import api from "./api";
import { Task, TaskPayload } from "@/types/task";
import { TaskListResponse, TaskResponse } from "@/types/api";

export interface TaskFilters {
  search?: string;
  status?: string;
}

export const taskService = {
  async getAll(
    page: number = 1,
    perPage: number = 9,
    filters: TaskFilters = {},
  ): Promise<TaskListResponse> {
    const params: Record<string, string | number> = { page, per_page: perPage };
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    const response = await api.get<TaskListResponse>("/tasks", { params });
    return response.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data.data!;
  },

  async create(data: TaskPayload): Promise<Task> {
    const response = await api.post<TaskResponse>("/tasks", data);
    return response.data.data!;
  },

  async update(id: number, data: TaskPayload): Promise<Task> {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
    return response.data.data!;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async toggleStatus(id: number): Promise<Task> {
    const response = await api.patch<TaskResponse>(`/tasks/${id}/status`);
    return response.data.data!;
  },
};
