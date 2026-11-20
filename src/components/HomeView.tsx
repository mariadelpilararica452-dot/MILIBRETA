import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Plus,
} from 'lucide-react';
import { formatShortDate, getTodayISO } from '../data/initialData';
import { ClassSession, TabId, Task } from '../types';

interface HomeViewProps {
  classes: ClassSession[];
  tasks: Task[];
  onNavigate: (tab: TabId) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  onAddClass: () => void;
  onAddNote: () => void;
}

export function HomeView({
  classes,
  tasks,
  onNavigate,
  onToggleTask,
  onAddTask,
  onAddClass,
  onAddNote,
}: HomeViewProps) {
  const today = getTodayISO();

  const upcomingClasses = [...classes]
    .filter((c) => c.date >= today)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
    .slice(0, 3);

  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pendiente')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedCount = tasks.filter((t) => t.status === 'completada').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Resumen principal */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm font-medium text-blue-700">Curso de Google AI Studio</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Tu resumen de hoy
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Tienes{' '}
          <span className="font-semibold text-slate-900 tabular-nums">
            {pendingTasks.length} {pendingTasks.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
          </span>{' '}
          y{' '}
          <span className="font-semibold text-slate-900 tabular-nums">
            {upcomingClasses.length} {upcomingClasses.length === 1 ? 'clase próxima' : 'clases próximas'}
          </span>
          . Progreso actual: <span className="font-semibold text-slate-900 tabular-nums">{progressPercent}%</span>.
        </p>

        {/* Acciones rápidas con botones grandes y claros */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={onAddTask}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span>Nueva tarea</span>
          </button>
          <button
            type="button"
            onClick={onAddClass}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <Calendar className="h-5 w-5 shrink-0 text-blue-700" />
            <span>Nueva clase</span>
          </button>
          <button
            type="button"
            onClick={onAddNote}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-blue-700"
          >
            <FileText className="h-5 w-5 shrink-0 text-blue-700" />
            <span>Nueva nota</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Próximas clases */}
        <section aria-labelledby="proximas-clases-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 id="proximas-clases-heading" className="text-xl font-bold text-slate-900">
              Próximas clases
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('calendario')}
              className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
            >
              <span>Ver calendario</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-base text-slate-600">No tienes clases programadas próximamente.</p>
              <button
                type="button"
                onClick={onAddClass}
                className="mt-4 min-h-[44px] rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Programar una clase
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span className="font-semibold text-blue-700">
                      {cls.date === today ? 'Hoy' : formatShortDate(cls.date)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Clock className="h-3.5 w-3.5" />
                      {cls.time} ({cls.duration})
                    </span>
                  </div>
                  <h4 className="mt-1 text-base font-bold text-slate-900">{cls.title}</h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {cls.module} · {cls.instructor}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Tareas pendientes */}
        <section aria-labelledby="tareas-pendientes-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 id="tareas-pendientes-heading" className="text-xl font-bold text-slate-900">
              Tareas pendientes
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('tareas')}
              className="flex min-h-[44px] items-center gap-1 rounded-lg px-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
            >
              <span>Ver todas</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
              <p className="mt-2 text-base font-semibold text-slate-900">
                ¡Todas las tareas están completadas!
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Puedes agregar una nueva tarea cuando lo necesites.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white">
              {pendingTasks.slice(0, 4).map((task) => {
                const isOverdue = task.dueDate < today;
                return (
                  <div key={task.id} className="flex items-start gap-3 p-4 sm:p-5">
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={`Marcar "${task.title}" como completada`}
                      className="mt-0.5 flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-blue-700"
                    >
                      <Circle className="h-6 w-6" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-slate-900">{task.title}</h4>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">{task.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className={isOverdue ? 'font-semibold text-red-700' : 'font-medium text-amber-700'}>
                          Entrega: {task.dueDate === today ? 'Hoy' : formatShortDate(task.dueDate)}
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="text-slate-500">{task.module}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
