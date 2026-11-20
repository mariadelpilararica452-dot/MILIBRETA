import { ClassSession, Note, Task } from '../types';

export const COURSE_MODULES = [
  'Fundamentos de Prompts',
  'Modelos Multimodales',
  'API y SDK de Gemini',
  'Salida Estructurada y Herramientas',
  'Evaluación y Seguridad',
];

export function getTodayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysISO(baseISO: string, days: number): string {
  const [y, m, d] = baseISO.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatShortDate(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function formatLongDate(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const formatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getDayParts(isoDate: string): { weekdayShort: string; dayNumber: string } {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
  return {
    weekdayShort: weekday.replace('.', '').slice(0, 3).toUpperCase(),
    dayNumber: String(d),
  };
}

export function createInitialData(): {
  classes: ClassSession[];
  tasks: Task[];
  notes: Note[];
} {
  const today = getTodayISO();

  const classes: ClassSession[] = [
    {
      id: 'cls-1',
      title: 'Diseño de instrucciones y System Prompts',
      module: 'Fundamentos de Prompts',
      date: today,
      time: '18:00',
      duration: '60 min',
      instructor: 'Dra. Elena Vargas',
    },
    {
      id: 'cls-2',
      title: 'Análisis de imágenes y documentos en AI Studio',
      module: 'Modelos Multimodales',
      date: addDaysISO(today, 1),
      time: '19:00',
      duration: '75 min',
      instructor: 'Ing. Carlos Mendoza',
    },
    {
      id: 'cls-3',
      title: 'Exportar código con el SDK @google/genai',
      module: 'API y SDK de Gemini',
      date: addDaysISO(today, 3),
      time: '18:30',
      duration: '90 min',
      instructor: 'Dra. Elena Vargas',
    },
    {
      id: 'cls-4',
      title: 'Respuestas en JSON con esquemas estrictos',
      module: 'Salida Estructurada y Herramientas',
      date: addDaysISO(today, 5),
      time: '17:00',
      duration: '60 min',
      instructor: 'Ing. Sofía Paredes',
    },
  ];

  const tasks: Task[] = [
    {
      id: 'tsk-1',
      title: 'Crear plantilla de prompt con ejemplos (Few-Shot)',
      description:
        'Diseñar un prompt en Google AI Studio con al menos 3 ejemplos de entrada y salida para clasificar reseñas de clientes.',
      dueDate: today,
      status: 'pendiente',
      module: 'Fundamentos de Prompts',
    },
    {
      id: 'tsk-2',
      title: 'Probar temperatura y Top-P en un asistente de estudio',
      description:
        'Comparar las respuestas del modelo usando temperatura 0.2 frente a 1.0 y anotar las diferencias de precisión.',
      dueDate: addDaysISO(today, 2),
      status: 'pendiente',
      module: 'Fundamentos de Prompts',
    },
    {
      id: 'tsk-3',
      title: 'Subir un PDF y extraer puntos clave',
      description:
        'Cargar un documento técnico en Google AI Studio y generar un resumen estructurado con 5 conclusiones principales.',
      dueDate: addDaysISO(today, 4),
      status: 'pendiente',
      module: 'Modelos Multimodales',
    },
    {
      id: 'tsk-4',
      title: 'Configurar clave API y ejecutar primera consulta',
      description:
        'Generar una clave en Google AI Studio y verificar la respuesta inicial desde un proyecto en TypeScript.',
      dueDate: addDaysISO(today, -1),
      status: 'completada',
      module: 'API y SDK de Gemini',
    },
    {
      id: 'tsk-5',
      title: 'Definir esquema JSON para lista de tareas',
      description:
        'Configurar responseSchema en AI Studio para garantizar que el modelo devuelva siempre un arreglo JSON válido.',
      dueDate: addDaysISO(today, -2),
      status: 'completada',
      module: 'Salida Estructurada y Herramientas',
    },
  ];

  const notes: Note[] = [
    {
      id: 'not-1',
      title: 'Buenas prácticas para System Instructions',
      topic: 'Fundamentos de Prompts',
      content:
        'Definir siempre el rol del modelo, el tono de respuesta y el formato esperado al inicio. Evitar instrucciones contradictorias y separar las reglas con viñetas claras.',
      updatedAt: today,
    },
    {
      id: 'not-2',
      title: 'Diferencia entre Temperatura y Top-P',
      topic: 'Fundamentos de Prompts',
      content:
        'La temperatura baja (0.0 a 0.3) produce respuestas más deterministas, ideal para extracción de datos o resúmenes. Una temperatura más alta favorece la creatividad en lluvia de ideas.',
      updatedAt: addDaysISO(today, -1),
    },
    {
      id: 'not-3',
      title: 'Uso de archivos multimodales',
      topic: 'Modelos Multimodales',
      content:
        'Google AI Studio permite adjuntar imágenes, audio, video y archivos PDF directamente en el prompt. Conviene hacer preguntas específicas sobre secciones concretas del archivo.',
      updatedAt: addDaysISO(today, -2),
    },
    {
      id: 'not-4',
      title: 'Salida estructurada con JSON Schema',
      topic: 'Salida Estructurada y Herramientas',
      content:
        'Activar Structured Outputs evita errores de parseo en la aplicación. Siempre describir cada campo del esquema para que el modelo entienda qué tipo de dato colocar.',
      updatedAt: addDaysISO(today, -3),
    },
  ];

  return { classes, tasks, notes };
}
