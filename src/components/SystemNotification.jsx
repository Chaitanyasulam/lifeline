import { AlertTriangle, CheckCircle, Loader2, Info } from 'lucide-react';

export function SystemNotification({ notification }) {
  if (!notification) return null;

  const { phase, message } = notification;

  return (
    <div className={`system-notification phase-${phase}`}>
      {phase === 'detected' && (
        <>
          <AlertTriangle size={16} />
          <span>⚠ {message ?? 'SYSTEM CHANGE DETECTED'}</span>
        </>
      )}
      {phase === 'calculating' && (
        <>
          <Loader2 size={16} className="spin" />
          <span>{message ?? 'Recalculating optimal allocation…'}</span>
        </>
      )}
      {phase === 'complete' && (
        <>
          <CheckCircle size={16} />
          <span>✓ {message ?? 'NEW ALLOCATION FOUND'}</span>
        </>
      )}
      {phase === 'info' && (
        <>
          <Info size={16} />
          <span>{message}</span>
        </>
      )}
    </div>
  );
}
