import { RotateCcw } from 'lucide-react';
import { COURSE_MODULES } from '../data/initialData';
import { ClassSession, Note, Task } from '../types';

interface ProgressViewProps {
  classes: ClassSession[];
  tasks: Task[];
  notes: Note[];
  onResetSampleData: () => void;
}

export function ProgressView({
  classes,
  tasks,
  notes,
  onResetSampleData,
}: ProgressViewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completada').length;
  const pendingTasks = totalTasks - completedTasks;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Parámetros del anillo SVG
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const moduleBreakdown = COURSE_MODULES.map((mod) => {
    const modTasks = tasks.filter((t) => t.module === mod);
    const modCompleted = modTasks.filter((t) => t.status === 'completada').length;
    return {
      module: mod,
      total: modTasks.length,
      completed: modCompleted,
      pending: modTasks.length - modCompleted,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Progreso del curso</h2>
        <p className="mt-1 text-base text-slate-600">
          Resumen de tus tareas completadas y pendientes en Google AI Studio.
        </p>
      </div>

      {/* Tarjeta principal con anillo de progreso */}
      <section className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-300 ease-out"
              />
            </svg>
            <span className="absolute text-2xl font-bold text-slate-900 tabular-nums">
              {percent}%
            </span>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Avance en tareas</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900 tabular-nums">
              {completedTasks} de {totalTasks} completadas
            </h3>
            <p className="mt-1 text-base text-slate-600">
              {pendingTasks === 0 && totalTasks > 0
                ? '¡Excelente trabajo! Completaste todas tus tareas.'
                : `Te quedan ${pendingTasks} ${pendingTasks === 1 ? 'tarea pendiente' : 'tareas pendientes'}.`}
            </p>
          </div>
        </div>
      </section>

      {/* Métricas clave */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Completadas</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700 tabular-nums">{completedTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-amber-700 tabular-nums">{pendingTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Clases</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{classes.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-500">Notas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{notes.length}</p>
        </div>
      </div>

      {/* Desglose por tema */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="text-lg font-bold text-slate-900">Avance por tema del curso</h3>
        {moduleBreakdown.length === 0 ? (
          <p className="mt-3 text-base text-slate-600">
            Agrega tareas para ver el progreso desglosado por tema.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {moduleBreakdown.map((item) => {
              const modPercent = Math.round((item.completed / item.total) * 100);
              return (
                <div key={item.module}>
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold text-slate-900">{item.module}</span>
                    <span className="text-slate-600 tabular-nums whitespace-nowrap">
                      {item.completed}/{item.total} ({modPercent}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-700 transition-all duration-300"
                      style={{ width: `${modPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Opción para restaurar datos de ejemplo */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Datos de ejemplo</h3>
          <p className="mt-1 text-sm text-slate-600">
            Si editaste o eliminaste elementos de prueba, puedes restaurar el contenido inicial del curso.
          </p>
        </div>
        <button
          type="button"
          onClick={onResetSampleData}
          className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:mt-0 sm:w-auto whitespace-nowrap"
        >
          <RotateCcw className="h-4 w-4 shrink-0" />
          <span>Restaurar ejemplos</span>
        </button>
      </section>
    </div>
  );
}
