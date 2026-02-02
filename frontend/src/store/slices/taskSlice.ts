import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';
import { taskService, TaskFilters } from '@/services/taskService';

interface Pagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  pagination: Pagination;
  filters: TaskFilters;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  pagination: {
    page: 1,
    per_page: 9,
    total: 0,
    total_pages: 0,
  },
  filters: {},
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ page = 1, perPage = 9, filters = {} }: { page?: number; perPage?: number; filters?: TaskFilters } = {}) => {
    const response = await taskService.getAll(page, perPage, filters);
    return { ...response, filters };
  }
);

export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (id: number) => {
    return await taskService.getById(id);
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (data: CreateTaskPayload) => {
    return await taskService.create(data);
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, data }: { id: number; data: UpdateTaskPayload }) => {
    return await taskService.update(id, data);
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (id: number) => {
    await taskService.delete(id);
    return id;
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'task/toggleStatus',
  async (id: number) => {
    return await taskService.toggleStatus(id);
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentTask: (state, action: PayloadAction<Task>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data;
        state.pagination = action.payload.pagination;
        state.filters = action.payload.filters;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao buscar tarefas';
      })
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao buscar tarefa';
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao criar tarefa';
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao atualizar tarefa';
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.pagination.total -= 1;
        if (state.currentTask?.id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Falha ao excluir tarefa';
      })
      .addCase(toggleTaskStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(toggleTaskStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Falha ao alterar status da tarefa';
      });
  },
});

export const { clearCurrentTask, clearError, setCurrentTask } = taskSlice.actions;
export default taskSlice.reducer;
