export type TabId = 'inicio' | 'calendario' | 'tareas' | 'notas' | 'progreso';

export type TaskStatus = 'pendiente' | 'completada';

export interface ClassSession {
  id: string;
  title: string;
  module: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: string;
  instructor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  module: string;
}

export interface Note {
  id: string;
  title: string;
  topic: string;
  content: string;
  updatedAt: string; // YYYY-MM-DD
}
