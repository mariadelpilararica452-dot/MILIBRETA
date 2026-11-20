import { useState } from 'react';
import { Download, WifiOff } from 'lucide-react';
import { useOnlineStatus, usePWAInstall } from '../hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-700 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 whitespace-nowrap"
      >
        <Download className="h-4 w-4 shrink-0" />
        <span>Instalar app</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
        >
          <Download className="h-4 w-4 shrink-0 text-blue-700" />
          <span>Instalar</span>
        </button>

        {showIOSGuide && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-xs sm:items-center"
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowIOSGuide(false);
            }}
          >
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-bold text-slate-900">Instalar en iPhone</h2>
              <p className="mt-2 text-base leading-relaxed text-slate-600">
                1. Toca el botón <strong>Compartir</strong> en la barra de Safari.
                <br />
                2. Desliza y toca <strong>Agregar a inicio</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full min-h-[48px] rounded-xl bg-blue-700 py-3 text-base font-semibold text-white hover:bg-blue-800"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-amber-600 px-4 py-2 text-xs font-semibold text-white"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0" />
      <span>Sin conexión — La app sigue funcionando en tu teléfono</span>
    </div>
  );
}
