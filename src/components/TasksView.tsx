import { useState } from 'react';
import { CheckCircle2, Circle, Pencil, Plus, Trash2 } from 'lucide-react';
import { formatShortDate, getTodayISO } from '../data/initialData';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
}

type TaskFilter = 'todas' | 'pendiente' | 'completada';

export function TasksView({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: TasksViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('todas');
  const today = getTodayISO();

  const pendingCount = tasks.filter((t) => t.status === 'pendiente').length;
  const completedCount = tasks.filter((t) => t.status === 'completada').length;

  const filteredTasks = [...tasks]
    .filter((t) => (filter === 'todas' ? true : t.status === filter))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'pendiente' ? -1 : 1;
      return a.dueDate.localeCompare(b.dueDate);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tareas</h2>
          <p className="mt-1 text-base text-slate-600">
            Administra tus entregas del curso y marca las que ya completaste.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar tarea</span>
        </button>
      </div>

      {/* Filtros de estado */}
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-200/70 p-1 sm:max-w-md">
        <button
          type="button"
          onClick={() => setFilter('todas')}
          className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
            filter === 'todas'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Todas ({tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pendiente')}
          className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
            filter === 'pendiente'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completada')}
          className={`min-h-[44px] rounded-lg px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
            filter === 'completada'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Completadas ({completedCount})
        </button>
      </div>

      {/* Lista de tareas */}
      {filteredTasks.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-base font-semibold text-slate-900">
            No hay tareas en esta categoría.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Usa el botón "Agregar tarea" para crear una nueva entrega.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completada';
            const isOverdue = !isCompleted && task.dueDate < today;

            return (
              <article
                key={task.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span
                      className={`font-semibold ${
                        isCompleted ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isCompleted ? 'Completada' : 'Pendiente'}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span
                      className={`tabular-nums ${
                        isOverdue ? 'font-semibold text-red-700' : 'text-slate-600'
                      }`}
                    >
                      Entrega: {task.dueDate === today ? 'Hoy' : formatShortDate(task.dueDate)}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{task.module}</span>
                  </div>

                  <h3
                    className={`mt-2 text-lg font-bold ${
                      isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="mt-1.5 text-base leading-relaxed text-slate-600">
                    {task.description}
                  </p>
                </div>

                {/* Botones grandes y claros de acción */}
                <div className="mt-5 flex flex-wrap gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                      isCompleted
                        ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        : 'bg-emerald-700 text-white hover:bg-emerald-800'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <Circle className="h-4 w-4 shrink-0" />
                        <span>Marcar pendiente</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Marcar completada</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                  >
                    <Pencil className="h-4 w-4 shrink-0" />
                    <span>Editar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task)}
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 whitespace-nowrap"
                  >
                    <Trash2 className="h-4 w-4 shrink-0" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
