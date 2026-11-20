import { useState } from 'react';
import { CalendarDays, Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  addDaysISO,
  formatLongDate,
  formatShortDate,
  getDayParts,
  getTodayISO,
} from '../data/initialData';
import { ClassSession, Task } from '../types';

interface CalendarViewProps {
  classes: ClassSession[];
  tasks: Task[];
  onAddClass: (defaultDate?: string) => void;
  onEditClass: (cls: ClassSession) => void;
  onDeleteClass: (cls: ClassSession) => void;
  onEditTask: (task: Task) => void;
}

export function CalendarView({
  classes,
  tasks,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onEditTask,
}: CalendarViewProps) {
  const today = getTodayISO();
  const [viewMode, setViewMode] = useState<'dia' | 'semana'>('dia');
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // 7 días a partir de ayer para mostrar la semana actual con contexto
  const weekDays = Array.from({ length: 7 }, (_, i) => addDaysISO(today, i - 1));

  const getItemsForDate = (dateISO: string) => {
    const dayClasses = classes
      .filter((c) => c.date === dateISO)
      .sort((a, b) => a.time.localeCompare(b.time));
    const dayTasks = tasks.filter((t) => t.dueDate === dateISO);
    return { dayClasses, dayTasks };
  };

  const selectedItems = getItemsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Cabecera de sección y selector de vista */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Calendario</h2>
          <p className="mt-1 text-base text-slate-600">
            Consulta tus clases y fechas de entrega por día o por semana.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddClass(selectedDate)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar clase</span>
        </button>
      </div>

      {/* Selector Por día / Por semana */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 sm:max-w-xs">
        <button
          type="button"
          onClick={() => setViewMode('dia')}
          className={`min-h-[44px] rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
            viewMode === 'dia'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Por día
        </button>
        <button
          type="button"
          onClick={() => setViewMode('semana')}
          className={`min-h-[44px] rounded-lg px-4 py-2 text-base font-semibold transition-colors ${
            viewMode === 'semana'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Por semana
        </button>
      </div>

      {viewMode === 'dia' ? (
        <div className="space-y-6">
          {/* Selector horizontal de días */}
          <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Seleccionar día">
            {weekDays.map((dayISO) => {
              const { weekdayShort, dayNumber } = getDayParts(dayISO);
              const { dayClasses, dayTasks } = getItemsForDate(dayISO);
              const hasActivity = dayClasses.length + dayTasks.length > 0;
              const isSelected = dayISO === selectedDate;
              const isToday = dayISO === today;

              return (
                <button
                  key={dayISO}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedDate(dayISO)}
                  className={`flex min-h-[72px] min-w-[64px] flex-1 flex-col items-center justify-center rounded-2xl border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-blue-700 ${
                    isSelected
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {isToday ? 'HOY' : weekdayShort}
                  </span>
                  <span className="mt-1 text-lg font-bold tabular-nums">{dayNumber}</span>
                  <span
                    className={`mt-1 text-[11px] font-medium tabular-nums ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {hasActivity ? `${dayClasses.length + dayTasks.length} act.` : 'Libre'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actividades del día seleccionado */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">{formatLongDate(selectedDate)}</h3>

            {selectedItems.dayClasses.length === 0 && selectedItems.dayTasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-base font-semibold text-slate-900">
                  Sin actividades para este día
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Puedes agregar una clase o seleccionar otro día de la semana.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedItems.dayClasses.map((cls) => (
                  <article
                    key={cls.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="font-semibold text-blue-700">Clase</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Clock className="h-3.5 w-3.5" />
                        {cls.time} ({cls.duration})
                      </span>
                    </div>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">{cls.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {cls.module} · {cls.instructor}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => onEditClass(cls)}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Editar clase</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteClass(cls)}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </article>
                ))}

                {selectedItems.dayTasks.map((task) => (
                  <article
                    key={task.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span
                        className={`font-semibold ${
                          task.status === 'completada' ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        Entrega de tarea ({task.status === 'completada' ? 'Completada' : 'Pendiente'})
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{task.module}</span>
                    </div>
                    <h4 className="mt-1 text-lg font-bold text-slate-900">{task.title}</h4>
                    <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Editar tarea</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Vista por semana */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weekDays.map((dayISO) => {
            const { dayClasses, dayTasks } = getItemsForDate(dayISO);
            const isToday = dayISO === today;
            const totalItems = dayClasses.length + dayTasks.length;

            return (
              <section
                key={dayISO}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {isToday ? `Hoy · ${formatShortDate(dayISO)}` : formatLongDate(dayISO)}
                  </h3>
                  <span className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap">
                    {totalItems} {totalItems === 1 ? 'actividad' : 'actividades'}
                  </span>
                </div>

                {totalItems === 0 ? (
                  <p className="py-5 text-sm text-slate-500">Sin actividades programadas.</p>
                ) : (
                  <ul className="mt-3 space-y-3">
                    {dayClasses.map((cls) => (
                      <li key={cls.id} className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="font-semibold text-blue-700">Clase · {cls.time}</span>
                          <button
                            type="button"
                            onClick={() => onEditClass(cls)}
                            className="font-semibold text-slate-700 underline hover:text-blue-700"
                          >
                            Editar
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-bold text-slate-900">{cls.title}</p>
                        <p className="mt-0.5 text-xs text-slate-600">{cls.module}</p>
                      </li>
                    ))}
                    {dayTasks.map((task) => (
                      <li key={task.id} className="rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span
                            className={`font-semibold ${
                              task.status === 'completada' ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            Tarea · {task.status === 'completada' ? 'Completada' : 'Pendiente'}
                          </span>
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="font-semibold text-slate-700 underline hover:text-blue-700"
                          >
                            Editar
                          </button>
                        </div>
                        <p className="mt-1 text-sm font-bold text-slate-900">{task.title}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
