import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createTask,
  updateTask,
  fetchTaskById,
  clearCurrentTask,
  fetchTasks,
  TaskState,
} from "@/store/slices/taskSlice";
import {
  closeCreateModal,
  closeEditModal,
  closeViewModal,
  openEditModal,
  showNotification,
} from "@/store/slices/uiSlice";
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import type { ApiValidationError } from "@/services/api";
import { TaskPayload } from "@/types/task";

export function CreateTaskModal() {
  const dispatch = useAppDispatch();
  const { isCreateModalOpen } = useAppSelector((state) => state.ui);
  const { loading, pagination } = useAppSelector<TaskState>(
    (state) => state.task,
  );

  const [fieldErrors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isCreateModalOpen) {
      setErrors({});
    }
  }, [isCreateModalOpen]);

  const handleSubmit = async (data: TaskPayload) => {
    setErrors({});
    try {
      await dispatch(createTask(data)).unwrap();
      dispatch(closeCreateModal());
      dispatch(
        showNotification({
          type: "success",
          message: "Tarefa criada com sucesso!!!!!!",
        }),
      );
      dispatch(
        fetchTasks({ page: pagination.page, perPage: pagination.per_page }),
      );
    } catch (error) {
      const apiError = error as ApiValidationError;
      if (apiError.errors) {
        setErrors(apiError.errors);
      } else {
        dispatch(
          showNotification({ type: "error", message: apiError.message }),
        );
      }
    }
  };

  return (
    <Dialog
      open={isCreateModalOpen}
      onOpenChange={() => dispatch(closeCreateModal())}
    >
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
          fieldErrors={fieldErrors}
        />
      </DialogContent>
    </Dialog>
  );
}

export function EditTaskModal() {
  const dispatch = useAppDispatch();
  const { isEditModalOpen, selectedTaskId } = useAppSelector(
    (state) => state.ui,
  );
  const { currentTask, loading, pagination } = useAppSelector(
    (state) => state.task,
  );
  const [fieldErrors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditModalOpen && selectedTaskId) {
      dispatch(fetchTaskById(selectedTaskId));
      setErrors({});
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [isEditModalOpen, selectedTaskId, dispatch]);

  const handleSubmit = async (data: TaskPayload) => {
    if (!selectedTaskId) return;
    setErrors({});
    try {
      await dispatch(updateTask({ id: selectedTaskId, data })).unwrap();
      dispatch(closeEditModal());
      dispatch(
        showNotification({
          type: "success",
          message: "Tarefa atualizada com sucesso!",
        }),
      );
      dispatch(
        fetchTasks({ page: pagination.page, perPage: pagination.per_page }),
      );
    } catch (error) {
      const apiError = error as ApiValidationError;
      if (apiError.errors) {
        setErrors(apiError.errors);
      } else {
        dispatch(
          showNotification({ type: "error", message: apiError.message }),
        );
      }
    }
  };

  return (
    <Dialog
      open={isEditModalOpen}
      onOpenChange={() => dispatch(closeEditModal())}
    >
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
          fieldErrors={fieldErrors}
        />
      </DialogContent>
    </Dialog>
  );
}

export function ViewTaskModal() {
  const dispatch = useAppDispatch();
  const { isViewModalOpen, selectedTaskId } = useAppSelector(
    (state) => state.ui,
  );
  const { currentTask, loading } = useAppSelector((state) => state.task);
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [titleOverflows, setTitleOverflows] = useState(false);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isViewModalOpen && selectedTaskId) {
      dispatch(fetchTaskById(selectedTaskId));
      setTitleExpanded(false);
      setDescriptionExpanded(false);
    }
    return () => {
      dispatch(clearCurrentTask());
    };
  }, [isViewModalOpen, selectedTaskId, dispatch]);

  useEffect(() => {
    if (currentTask && !loading) {
      requestAnimationFrame(() => {
        if (titleRef.current) {
          setTitleOverflows(
            titleRef.current.scrollHeight > titleRef.current.clientHeight,
          );
        }
        if (descriptionRef.current) {
          setDescriptionOverflows(
            descriptionRef.current.scrollHeight >
              descriptionRef.current.clientHeight,
          );
        }
      });
    }
  }, [currentTask, loading]);

  const handleEdit = () => {
    if (selectedTaskId) {
      dispatch(closeViewModal());
      dispatch(openEditModal(selectedTaskId));
    }
  };

  return (
    <Dialog
      open={isViewModalOpen}
      onOpenChange={() => dispatch(closeViewModal())}
    >
      <DialogContent>
        <DialogHeader className="!flex-row !space-y-0 items-center justify-between pr-8">
          <DialogTitle>Detalhes da Tarefa</DialogTitle>
          {currentTask && <TaskStatusBadge status={currentTask.status} />}
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Carregando...
          </div>
        ) : currentTask ? (
          <>
            <div className="overflow-y-auto min-h-0 -mr-4 pr-4 custom-scrollbar">
              <h3
                ref={titleRef}
                className={`text-xl font-semibold ${titleExpanded ? "" : "line-clamp-3"}`}
              >
                {currentTask.title}
              </h3>
              {(titleOverflows || titleExpanded) && (
                <button
                  type="button"
                  onClick={() => setTitleExpanded(!titleExpanded)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                >
                  {titleExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3" /> Recolher título
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" /> Expandir título
                    </>
                  )}
                </button>
              )}
              {currentTask.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">
                    Descrição
                  </h4>
                  <p
                    ref={descriptionRef}
                    className={`text-sm whitespace-pre-wrap ${descriptionExpanded ? "" : "line-clamp-10"}`}
                  >
                    {currentTask.description}
                  </p>
                  {(descriptionOverflows || descriptionExpanded) && (
                    <button
                      type="button"
                      onClick={() =>
                        setDescriptionExpanded(!descriptionExpanded)
                      }
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                    >
                      {descriptionExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3" /> Recolher descrição
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" /> Expandir descrição
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t text-sm shrink-0">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground">
                  Criado:{" "}
                  {new Date(currentTask.created_at).toLocaleString("pt-BR")}
                </span>
                {currentTask.updated_at !== currentTask.created_at && (
                  <span className="text-muted-foreground/60">
                    Atualizado:{" "}
                    {new Date(currentTask.updated_at).toLocaleString("pt-BR")}
                  </span>
                )}
              </div>
              <Button size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Tarefa não encontrada
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
