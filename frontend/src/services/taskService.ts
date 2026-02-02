import api from "./api";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types/task";
import { TaskListResponse, TaskResponse } from "@/types/api";

export const taskService = {
  async getAll(
    page: number = 1,
    perPage: number = 10,
  ): Promise<TaskListResponse> {
    const response = await api.get<TaskListResponse>("/tasks", {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  async getById(id: number): Promise<Task> {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data.data!;
  },

  async create(data: CreateTaskPayload): Promise<Task> {
    const response = await api.post<TaskResponse>("/tasks", data);
    return response.data.data!;
  },

  async update(id: number, data: UpdateTaskPayload): Promise<Task> {
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
