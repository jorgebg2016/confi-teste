import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteTask, fetchTasks } from "@/store/slices/taskSlice";
import { closeDeleteDialog, showNotification } from "@/store/slices/uiSlice";

export function DeleteConfirmDialog() {
  const dispatch = useAppDispatch();
  const { isDeleteDialogOpen, selectedTaskId } = useAppSelector(
    (state) => state.ui,
  );
  const { loading, pagination } = useAppSelector((state) => state.task);

  const handleDelete = async () => {
    if (!selectedTaskId) return;
    try {
      await dispatch(deleteTask(selectedTaskId)).unwrap();
      dispatch(closeDeleteDialog());
      dispatch(
        showNotification({
          type: "success",
          message: "Tarefa excluída com sucesso!",
        }),
      );
      dispatch(
        fetchTasks({ page: pagination.page, perPage: pagination.per_page }),
      );
    } catch (error) {
      dispatch(
        showNotification({ type: "error", message: (error as Error).message }),
      );
    }
  };

  return (
    <AlertDialog
      open={isDeleteDialogOpen}
      onOpenChange={() => dispatch(closeDeleteDialog())}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
