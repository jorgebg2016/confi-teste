export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: 'Pendente' | 'Concluido';
  created_at: string;
  updated_at: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: 'Pendente' | 'Concluido';
}
