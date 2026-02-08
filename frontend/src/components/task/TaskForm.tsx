import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Task, TaskPayload } from "@/types/task";

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: TaskPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
  fieldErrors?: Record<string, string>;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  isLoading,
  fieldErrors = {},
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("O título é obrigatório");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Título *
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da tarefa"
          disabled={isLoading}
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-destructive">
            {error || fieldErrors.title || ""}
          </p>
          <span
            className={`text-xs ${title.length > 255 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {title.length}/255
          </span>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição (opcional)"
          rows={4}
          disabled={isLoading}
        />
        <div className="flex justify-between mt-1">
          <p className="text-sm text-destructive">
            {fieldErrors.description || ""}
          </p>
          <span
            className={`text-xs ${description.length > 10000 ? "text-destructive" : "text-muted-foreground"}`}
          >
            {description.length}/10.000
          </span>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : task ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  );
}
