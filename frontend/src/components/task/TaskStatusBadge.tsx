import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';

interface TaskStatusBadgeProps {
  status: Task['status'];
}

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const variant = status === 'Concluido' ? 'success' : 'warning';

  return (
    <Badge variant={variant}>
      {status}
    </Badge>
  );
}
