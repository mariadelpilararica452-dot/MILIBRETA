import { useState } from 'react';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { COURSE_MODULES, formatShortDate } from '../data/initialData';
import { Note } from '../types';

interface NotesViewProps {
  notes: Note[];
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
}

export function NotesView({ notes, onAddNote, onEditNote, onDeleteNote }: NotesViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('Todos');

  const availableTopics = ['Todos', ...COURSE_MODULES];
  const filteredNotes =
    selectedTopic === 'Todos' ? notes : notes.filter((n) => n.topic === selectedTopic);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notas del curso</h2>
          <p className="mt-1 text-base text-slate-600">
            Guarda tus apuntes, ideas y resúmenes de cada tema de Google AI Studio.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddNote}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700 whitespace-nowrap"
        >
          <Plus className="h-5 w-5" />
          <span>Agregar nota</span>
        </button>
      </div>

      {/* Filtro por tema */}
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar notas por tema">
        {availableTopics.map((topic) => {
          const isActive = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedTopic(topic)}
              className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-blue-700 bg-blue-700 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>

      {filteredNotes.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
          <p className="mt-2 text-base font-semibold text-slate-900">
            No hay notas para este tema todavía.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Toca "Agregar nota" para escribir tus primeros apuntes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span className="font-semibold text-blue-700">{note.topic}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Actualizado: {formatShortDate(note.updatedAt)}</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{note.title}</h3>
                <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-700">
                  {note.content}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => onEditNote(note)}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                >
                  <Pencil className="h-4 w-4 shrink-0" />
                  <span>Editar nota</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteNote(note)}
                  className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 whitespace-nowrap"
                >
                  <Trash2 className="h-4 w-4 shrink-0" />
                  <span>Eliminar</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
