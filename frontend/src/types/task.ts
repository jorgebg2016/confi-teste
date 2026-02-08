export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "Pendente" | "Concluido";
  created_at: string;
  updated_at: string;
}

export interface TaskPayload {
  title?: string;
  description?: string | null;
  status?: "Pendente" | "Concluido";
}
