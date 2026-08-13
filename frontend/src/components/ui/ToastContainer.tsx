'use client';
import { useToast } from '@/hooks/useToast';

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 4.5L6.5 11.5L3 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4 12M4 4L12 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="#6C47FF" strokeWidth="2"/>
      <path d="M8 7v4M8 5.5v.5" stroke="#6C47FF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          role="alert"
        >
          {icons[t.type]}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="btn-ghost btn btn-icon btn-sm"
            style={{ color: 'rgba(255,255,255,0.5)', minWidth: 24, width: 24, height: 24, padding: 0 }}
            aria-label="Dismiss notification"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 2L2 10M2 2L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
