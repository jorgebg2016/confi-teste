import { useEffect } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, clearError } from '@/store/slices/taskSlice';
import { openCreateModal, clearNotification } from '@/store/slices/uiSlice';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  CreateTaskModal,
  EditTaskModal,
  ViewTaskModal,
} from './TaskModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function TaskList() {
  const dispatch = useAppDispatch();
  const { tasks, pagination, loading, error } = useAppSelector((state) => state.task);
  const { notification } = useAppSelector((state) => state.ui);

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, perPage: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handlePageChange = (newPage: number) => {
    dispatch(fetchTasks({ page: newPage, perPage: pagination.per_page }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Minhas Tarefas</h2>
          <p className="text-muted-foreground">
            {pagination.total} tarefa{pagination.total !== 1 ? 's' : ''} no total
          </p>
        </div>
        <Button onClick={() => dispatch(openCreateModal())}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {notification && (
        <Alert variant={notification.type === 'error' ? 'destructive' : 'success'}>
          {notification.type === 'error' ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Carregando tarefas...
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Nenhuma tarefa encontrada.</p>
          <Button onClick={() => dispatch(openCreateModal())}>
            <Plus className="h-4 w-4 mr-2" />
            Criar primeira tarefa
          </Button>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Página {pagination.page} de {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.total_pages || loading}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <CreateTaskModal />
      <EditTaskModal />
      <ViewTaskModal />
      <DeleteConfirmDialog />
    </div>
  );
}
