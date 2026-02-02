import { Task } from '@/types/task';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Eye, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleTaskStatus } from '@/store/slices/taskSlice';
import {
  openViewModal,
  openEditModal,
  openDeleteDialog,
} from '@/store/slices/uiSlice';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useAppDispatch();

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTaskStatus(task.id));
  };

  const handleView = () => {
    dispatch(openViewModal(task.id));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openEditModal(task.id));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(openDeleteDialog(task.id));
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleView}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-1">{task.title}</CardTitle>
          <TaskStatusBadge status={task.status} />
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {new Date(task.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            {task.updated_at !== task.created_at && (
              <span className="text-xs text-muted-foreground/60">
                Atualizado: {new Date(task.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStatus}
              title={task.status === 'Pendente' ? 'Marcar como concluído' : 'Marcar como pendente'}
            >
              {task.status === 'Pendente' ? (
                <ToggleLeft className="h-4 w-4" />
              ) : (
                <ToggleRight className="h-4 w-4 text-green-500" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleView} title="Visualizar">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleEdit} title="Editar">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} title="Excluir">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
