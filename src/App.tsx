import React, { useState } from 'react';
import { Pencil, Search, Trash2, X } from 'lucide-react';
import { OfflineIndicator, PWAInstallButton } from './components/PWAInstallButton';

type Prioridad = 'Baja' | 'Media' | 'Alta';
type FiltroPrioridad = 'Todas' | Prioridad;

interface Actividad {
  id: number;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  prioridad: Prioridad;
  completada: boolean;
}

const OPCIONES_PRIORIDAD: Prioridad[] = ['Baja', 'Media', 'Alta'];
const OPCIONES_FILTRO: FiltroPrioridad[] = ['Todas', 'Alta', 'Media', 'Baja'];

const ESTILO_PRIORIDAD: Record<Prioridad, string> = {
  Alta: 'text-rose-600',
  Media: 'text-amber-600',
  Baja: 'text-emerald-600',
};

const ESTILO_BOTON_PRIORIDAD: Record<Prioridad, string> = {
  Alta: 'bg-rose-600 text-white shadow-xs',
  Media: 'bg-amber-500 text-white shadow-xs',
  Baja: 'bg-emerald-600 text-white shadow-xs',
};

const ESTILO_BOTON_FILTRO: Record<FiltroPrioridad, string> = {
  Todas: 'bg-indigo-600 text-white shadow-xs',
  Alta: 'bg-rose-600 text-white shadow-xs',
  Media: 'bg-amber-500 text-white shadow-xs',
  Baja: 'bg-emerald-600 text-white shadow-xs',
};

function obtenerFechaHoyISO(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function formatearFecha(isoDate: string): string {
  if (!isoDate) return '';
  if (isoDate === obtenerFechaHoyISO()) return 'Hoy';
  const [anio, mes, dia] = isoDate.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(fecha);
}

const ACTIVIDADES_INICIALES: Actividad[] = [
  { id: 1, titulo: 'Repasar apuntes de la clase de hoy', fecha: obtenerFechaHoyISO(), prioridad: 'Alta', completada: false },
  { id: 2, titulo: 'Practicar ejercicios de programación', fecha: obtenerFechaHoyISO(), prioridad: 'Media', completada: false },
  { id: 3, titulo: 'Organizar pendientes de la semana', fecha: obtenerFechaHoyISO(), prioridad: 'Baja', completada: true },
];

export default function App() {
  const [textoActividad, setTextoActividad] = useState('');
  const [fechaActividad, setFechaActividad] = useState(obtenerFechaHoyISO);
  const [prioridadActividad, setPrioridadActividad] = useState<Prioridad>('Media');
  const [errorFormulario, setErrorFormulario] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState<FiltroPrioridad>('Todas');
  const [actividades, setActividades] = useState<Actividad[]>(ACTIVIDADES_INICIALES);

  // Estado del formulario de edición
  const [actividadEditandoId, setActividadEditandoId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editFecha, setEditFecha] = useState('');
  const [errorEdicion, setErrorEdicion] = useState('');

  const handleAgregarActividad = (e: React.FormEvent) => {
    e.preventDefault();
    const tituloLimpio = textoActividad.trim();
    if (!tituloLimpio) {
      setErrorFormulario('Por favor, escribe una actividad.');
      return;
    }

    const fechaFinal = fechaActividad.trim() || obtenerFechaHoyISO();

    setActividades((prev) => [
      {
        id: Date.now(),
        titulo: tituloLimpio,
        fecha: fechaFinal,
        prioridad: prioridadActividad,
        completada: false,
      },
      ...prev,
    ]);
    setTextoActividad('');
    setFechaActividad(obtenerFechaHoyISO());
    setPrioridadActividad('Media');
    setErrorFormulario('');
  };

  const handleCambiarEstado = (id: number) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completada: !item.completada } : item
      )
    );
  };

  const handleEliminarActividad = (id: number) => {
    setActividades((prev) => prev.filter((item) => item.id !== id));
  };

  const abrirEdicion = (actividad: Actividad) => {
    setActividadEditandoId(actividad.id);
    setEditTitulo(actividad.titulo);
    setEditFecha(actividad.fecha);
    setErrorEdicion('');
  };

  const cancelarEdicion = () => {
    setActividadEditandoId(null);
    setEditTitulo('');
    setEditFecha('');
    setErrorEdicion('');
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    const tituloLimpio = editTitulo.trim();
    if (!tituloLimpio) {
      setErrorEdicion('Por favor, escribe una actividad.');
      return;
    }

    const fechaFinal = editFecha.trim() || obtenerFechaHoyISO();
    setActividades((prev) =>
      prev.map((item) =>
        item.id === actividadEditandoId
          ? { ...item, titulo: tituloLimpio, fecha: fechaFinal }
          : item
      )
    );
    cancelarEdicion();
  };

  const completadasCount = actividades.filter((a) => a.completada).length;
  const porcentajeCompletadas =
    actividades.length > 0 ? Math.round((completadasCount / actividades.length) * 100) : 0;
  const terminoBusqueda = busqueda.trim().toLowerCase();
  const actividadesFiltradas = actividades.filter((a) => {
    const coincideBusqueda = !terminoBusqueda || a.titulo.toLowerCase().includes(terminoBusqueda);
    const coincidePrioridad = filtroPrioridad === 'Todas' || a.prioridad === filtroPrioridad;
    return coincideBusqueda && coincidePrioridad;
  });

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-900 sm:flex sm:items-center sm:justify-center sm:p-6">
      {/* Modelo de celular con bisel sutil en escritorio y pantalla completa en teléfono */}
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-indigo-50/40 sm:min-h-[820px] sm:max-h-[92vh] sm:rounded-[2.5rem] sm:border-[6px] sm:border-slate-800 sm:shadow-2xl sm:shadow-indigo-950/60">
        {/* Barra superior intensa con degradado moderno */}
        <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-sm">
          {/* Indicador superior discreto tipo auricular en vista de modelo de celular */}
          <div className="hidden justify-center pt-2.5 sm:flex" aria-hidden="true">
            <div className="h-1.5 w-16 rounded-full bg-white/30" />
          </div>
          <div className="flex h-14 items-center justify-between gap-3 px-4">
            <h1 className="text-xl font-bold tracking-tight text-white">
              Mi Agenda
            </h1>
            <PWAInstallButton />
          </div>
          <OfflineIndicator />
        </header>

        {/* Contenido principal desplazable */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-indigo-50/40 px-4 pt-5 pb-safe">
          {/* Formulario para agregar actividad */}
          <form
            onSubmit={handleAgregarActividad}
            noValidate
            className="space-y-3 rounded-3xl border border-indigo-100 bg-white p-4 shadow-xs"
          >
            <div>
              <label
                htmlFor="campo-actividad"
                className="block text-sm font-semibold text-indigo-950"
              >
                Nueva actividad
              </label>
              <input
                id="campo-actividad"
                type="text"
                value={textoActividad}
                onChange={(e) => {
                  setTextoActividad(e.target.value);
                  if (errorFormulario) setErrorFormulario('');
                }}
                placeholder="Escribe una actividad..."
                autoComplete="off"
                aria-invalid={Boolean(errorFormulario)}
                aria-describedby={errorFormulario ? 'error-actividad' : undefined}
                className={`mt-1.5 w-full min-h-[50px] rounded-2xl border bg-slate-50/60 px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none ${
                  errorFormulario
                    ? 'border-rose-600 focus:border-rose-600'
                    : 'border-indigo-200 focus:border-indigo-600'
                }`}
              />
              {errorFormulario && (
                <p
                  id="error-actividad"
                  role="alert"
                  className="mt-1.5 text-sm font-medium text-rose-600"
                >
                  {errorFormulario}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="campo-fecha"
                className="block text-sm font-semibold text-indigo-950"
              >
                Fecha (opcional, por defecto hoy)
              </label>
              <input
                id="campo-fecha"
                type="date"
                value={fechaActividad}
                onChange={(e) => setFechaActividad(e.target.value)}
                className="mt-1.5 w-full min-h-[50px] rounded-2xl border border-indigo-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-sm font-semibold text-indigo-950">
                Prioridad
              </span>
              <div
                role="radiogroup"
                aria-label="Nivel de prioridad"
                className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-2xl bg-indigo-50 p-1"
              >
                {OPCIONES_PRIORIDAD.map((nivel) => {
                  const activo = prioridadActividad === nivel;
                  return (
                    <button
                      key={nivel}
                      type="button"
                      role="radio"
                      aria-checked={activo}
                      onClick={() => setPrioridadActividad(nivel)}
                      className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                        activo
                          ? ESTILO_BOTON_PRIORIDAD[nivel]
                          : 'text-indigo-900/70 hover:text-indigo-950'
                      }`}
                    >
                      {nivel}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full min-h-[52px] rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-base font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:from-indigo-700 hover:to-violet-700 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Agregar actividad
            </button>
          </form>

          {/* Tarjeta de resumen de progreso con alto contraste */}
          <section
            aria-label="Resumen de progreso"
            className="mt-4 rounded-3xl bg-indigo-950 p-4 text-white shadow-sm"
          >
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">Progreso de tareas</p>
                <p className="mt-0.5 text-xs text-indigo-200 tabular-nums">
                  {completadasCount} de {actividades.length} completadas
                </p>
              </div>
              <span className="text-2xl font-bold text-cyan-300 tabular-nums">
                {porcentajeCompletadas}%
              </span>
            </div>
            <div
              className="mt-3 h-3 w-full overflow-hidden rounded-full bg-indigo-900"
              role="progressbar"
              aria-valuenow={porcentajeCompletadas}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Porcentaje de tareas completadas"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${porcentajeCompletadas}%` }}
              />
            </div>
          </section>

          {/* Encabezado de la lista y barra de búsqueda */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between px-1 text-sm">
              <span className="font-bold text-indigo-950">
                Actividades ({actividadesFiltradas.length})
              </span>
            </div>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-indigo-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar actividad por nombre..."
                aria-label="Buscar actividad por nombre"
                className="w-full min-h-[48px] rounded-2xl border border-indigo-200 bg-white py-2.5 pr-11 pl-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
              />
              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute top-1/2 right-1 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-xl text-indigo-500 hover:text-indigo-800"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Selector de filtros por prioridad */}
            <div
              role="radiogroup"
              aria-label="Filtrar por prioridad"
              className="grid grid-cols-4 gap-1 rounded-2xl border border-indigo-100 bg-white p-1"
            >
              {OPCIONES_FILTRO.map((opcion) => {
                const activo = filtroPrioridad === opcion;
                return (
                  <button
                    key={opcion}
                    type="button"
                    role="radio"
                    aria-checked={activo}
                    onClick={() => setFiltroPrioridad(opcion)}
                    className={`min-h-[40px] rounded-xl px-2 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      activo
                        ? ESTILO_BOTON_FILTRO[opcion]
                        : 'text-indigo-900/70 hover:bg-indigo-50 hover:text-indigo-950'
                    }`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista táctil de actividades */}
          <div className="mt-3 flex-1 space-y-2.5 pb-6">
            {actividades.length === 0 ? (
              <div className="rounded-2xl border border-indigo-100 bg-white p-6 text-center">
                <p className="text-base font-semibold text-indigo-950">
                  No hay actividades todavía
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Escribe una arriba y toca "Agregar actividad".
                </p>
              </div>
            ) : actividadesFiltradas.length === 0 ? (
              <div className="rounded-2xl border border-indigo-100 bg-white p-6 text-center">
                <p className="text-base font-semibold text-indigo-950">
                  No se encontraron actividades
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Prueba con otro nombre o cambia el filtro de prioridad.
                </p>
              </div>
            ) : (
              actividadesFiltradas.map((actividad) => (
                <div
                  key={actividad.id}
                  className="flex items-center gap-1 rounded-2xl border border-indigo-100 bg-white px-2 py-2.5 shadow-xs"
                >
                  <label className="flex min-h-[48px] min-w-[44px] cursor-pointer items-center justify-center rounded-xl active:bg-indigo-50">
                    <input
                      type="checkbox"
                      checked={actividad.completada}
                      onChange={() => handleCambiarEstado(actividad.id)}
                      aria-label={`Marcar "${actividad.titulo}" como completada`}
                      className="h-5 w-5 rounded border-indigo-300 accent-indigo-600"
                    />
                  </label>

                  <div className="min-w-0 flex-1 py-1 pr-1">
                    <p
                      className={`text-base leading-snug font-medium ${
                        actividad.completada
                          ? 'text-slate-400 line-through'
                          : 'text-slate-900'
                      }`}
                    >
                      {actividad.titulo}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs font-medium tabular-nums">
                      <span className="text-slate-500">{formatearFecha(actividad.fecha)}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className={`font-semibold ${ESTILO_PRIORIDAD[actividad.prioridad]}`}>
                        Prioridad {actividad.prioridad}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => abrirEdicion(actividad)}
                    aria-label={`Editar "${actividad.titulo}"`}
                    className="flex min-h-[48px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-700 active:bg-indigo-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEliminarActividad(actividad.id)}
                    aria-label={`Eliminar "${actividad.titulo}"`}
                    className="flex min-h-[48px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-700 active:bg-rose-100 focus-visible:outline-2 focus-visible:outline-rose-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Formulario sencillo de edición (hoja inferior en teléfono) */}
      {actividadEditandoId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-xs sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-editar-actividad"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancelarEdicion();
          }}
        >
          <div className="w-full max-w-[420px] rounded-t-3xl bg-white p-5 pb-safe shadow-xl sm:rounded-3xl">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-indigo-200 sm:hidden" aria-hidden="true" />
            <h2 id="titulo-editar-actividad" className="text-lg font-bold text-indigo-950">
              Editar actividad
            </h2>

            <form onSubmit={handleGuardarEdicion} noValidate className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="edit-titulo"
                  className="block text-sm font-semibold text-indigo-950"
                >
                  Nombre de la actividad
                </label>
                <input
                  id="edit-titulo"
                  type="text"
                  value={editTitulo}
                  onChange={(e) => {
                    setEditTitulo(e.target.value);
                    if (errorEdicion) setErrorEdicion('');
                  }}
                  placeholder="Escribe una actividad..."
                  autoComplete="off"
                  aria-invalid={Boolean(errorEdicion)}
                  aria-describedby={errorEdicion ? 'error-edicion' : undefined}
                  className={`mt-1.5 w-full min-h-[52px] rounded-2xl border bg-slate-50/60 px-4 py-3 text-base text-slate-900 focus:bg-white focus:outline-none ${
                    errorEdicion
                      ? 'border-rose-600 focus:border-rose-600'
                      : 'border-indigo-200 focus:border-indigo-600'
                  }`}
                />
                {errorEdicion && (
                  <p
                    id="error-edicion"
                    role="alert"
                    className="mt-1.5 text-sm font-medium text-rose-600"
                  >
                    {errorEdicion}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-fecha"
                  className="block text-sm font-semibold text-indigo-950"
                >
                  Fecha
                </label>
                <input
                  id="edit-fecha"
                  type="date"
                  value={editFecha}
                  onChange={(e) => setEditFecha(e.target.value)}
                  className="mt-1.5 w-full min-h-[52px] rounded-2xl border border-indigo-200 bg-slate-50/60 px-4 py-3 text-base text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={cancelarEdicion}
                  className="min-h-[52px] rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-base font-semibold text-indigo-900 hover:bg-indigo-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-h-[52px] rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-base font-semibold text-white hover:from-indigo-700 hover:to-violet-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
