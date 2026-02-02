import { CheckSquare } from "lucide-react";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Gestão de Tarefas</h1>
        </div>
      </div>
    </header>
  );
}
