import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createTask,
  updateTask,
  fetchTaskById,
  clearCurrentTask,
  fetchTasks,
} from '@/store/slices/taskSlice';
import {
  closeCreateModal,
  closeEditModal,
  closeViewModal,
  openEditModal,
  showNotification,
} from '@/store/slices/uiSlice';
import { Edit } from 'lucide-react';

export function CreateTaskModal() {
  const dispatch = useAppDispatch();
  const { isCreateModalOpen } = useAppSelector((state) => state.ui);
  const { loading, pagination } = useAppSelector((state) => state.task);

  const handleSubmit = async (data: { title: string; description?: string }) => {
    try {
      await dispatch(createTask(data)).unwrap();
      dispatch(closeCreateModal());
      dispatch(showNotification({ type: 'success', message: 'Tarefa criada com sucesso!' }));
      dispatch(fetchTasks({ page: pagination.page, perPage: pagination.per_page }));
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: (error as Error).message }));
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={() => dispatch(closeCreateModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar uma nova tarefa.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={() => dispatch(closeCreateModal())}
          isLoading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditTaskModal() {
  const dispatch = useAppDispatch();
  const { isEditModalOpen, selectedTaskId } = useAppSelector((state) => state.ui);
  const { currentTask, loading, pagination } = useAppSelector((state) => state.task);

  useEffect(() => {
    if (isEditModalOpen && selectedTaskId) {
      dispatch(fetchTaskById(selectedTaskId));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [isEditModalOpen, selectedTaskId, dispatch]);

  const handleSubmit = async (data: { title?: string; description?: string }) => {
    if (!selectedTaskId) return;
    try {
      await dispatch(updateTask({ id: selectedTaskId, data })).unwrap();
      dispatch(closeEditModal());
      dispatch(showNotification({ type: 'success', message: 'Tarefa atualizada com sucesso!' }));
      dispatch(fetchTasks({ page: pagination.page, perPage: pagination.per_page }));
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: (error as Error).message }));
    }
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={() => dispatch(closeEditModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
          <DialogDescription>
            Atualize os campos abaixo para editar a tarefa.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          task={currentTask}
          onSubmit={handleSubmit}
          onCancel={() => dispatch(closeEditModal())}
          isLoading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}

export function ViewTaskModal() {
  const dispatch = useAppDispatch();
  const { isViewModalOpen, selectedTaskId } = useAppSelector((state) => state.ui);
  const { currentTask, loading } = useAppSelector((state) => state.task);

  useEffect(() => {
    if (isViewModalOpen && selectedTaskId) {
      dispatch(fetchTaskById(selectedTaskId));
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [isViewModalOpen, selectedTaskId, dispatch]);

  const handleEdit = () => {
    if (selectedTaskId) {
      dispatch(closeViewModal());
      dispatch(openEditModal(selectedTaskId));
    }
  };

  return (
    <Dialog open={isViewModalOpen} onOpenChange={() => dispatch(closeViewModal())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando...</div>
        ) : currentTask ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{currentTask.title}</h3>
              <TaskStatusBadge status={currentTask.status} />
            </div>
            {currentTask.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                <p className="text-sm whitespace-pre-wrap">{currentTask.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Criado em:</span>
                <p>{new Date(currentTask.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Atualizado em:</span>
                <p>{new Date(currentTask.updated_at).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">Tarefa não encontrada</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
