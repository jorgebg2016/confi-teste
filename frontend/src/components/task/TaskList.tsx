import { useEffect, useState } from 'react';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, clearError } from '@/store/slices/taskSlice';
import { openCreateModal, clearNotification } from '@/store/slices/uiSlice';
import { Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Search, X } from 'lucide-react';
import {
  CreateTaskModal,
  EditTaskModal,
  ViewTaskModal,
} from './TaskModal';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function TaskList() {
  const dispatch = useAppDispatch();
  const { tasks, pagination, filters, loading, error } = useAppSelector((state) => state.task);
  const { notification } = useAppSelector((state) => state.ui);

  const [searchInput, setSearchInput] = useState('');
  const [statusInput, setStatusInput] = useState('');

  useEffect(() => {
    dispatch(fetchTasks({ page: 1, perPage: 9 }));
  }, [dispatch]);

  const handleFilter = () => {
    dispatch(fetchTasks({
      page: 1,
      perPage: 9,
      filters: {
        search: searchInput || undefined,
        status: statusInput || undefined,
      },
    }));
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setStatusInput('');
    dispatch(fetchTasks({ page: 1, perPage: 9, filters: {} }));
  };

  const hasActiveFilters = filters.search || filters.status;

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
    dispatch(fetchTasks({ page: newPage, perPage: pagination.per_page, filters }));
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

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por título ou descrição..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
          className="flex-1"
        />
        <select
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Concluido">Concluído</option>
        </select>
        <Button onClick={handleFilter}>
          <Search className="h-4 w-4 mr-2" />
          Filtrar
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between bg-muted/50 px-2 py-1 rounded-md -mt-3">
          <span className="text-xs text-muted-foreground">
            Filtros:
            {filters.search && <span className="ml-1 font-medium">"{filters.search}"</span>}
            {filters.search && filters.status && <span className="mx-1">•</span>}
            {filters.status && <span className="font-medium">{filters.status}</span>}
          </span>
          <Button onClick={handleResetFilters} variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        </div>
      )}

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
