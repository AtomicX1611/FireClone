'use client';
import type { MeetingSummary } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

interface SummaryPanelProps {
  summary: MeetingSummary | null;
  onChapterClick?: (time: number) => void;
  onGenerate?: () => void;
  generating?: boolean;
}

export function SummaryPanel({ summary, onChapterClick, onGenerate, generating }: SummaryPanelProps) {
  if (!summary) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M7 8h14M7 13h10M7 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <rect x="2.5" y="2.5" width="23" height="23" rx="4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <p className="empty-state-title">No summary yet</p>
        <p className="empty-state-desc">Generate an AI summary from your transcript</p>
        {onGenerate && (
          <button
            className="btn btn-primary"
            onClick={onGenerate}
            disabled={generating}
            style={{ marginTop: 12 }}
            id="generate-summary-btn"
          >
            {generating ? <span className="spinner spinner-sm" /> : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M7.5 1L9 5H13L10 7.5L11 12L7.5 9.5L4 12L5 7.5L2 5H6L7.5 1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            )}
            Generate Summary
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Overview */}
      <section aria-labelledby="summary-overview-heading">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h3 id="summary-overview-heading" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Overview
          </h3>
          {onGenerate && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={onGenerate}
              disabled={generating}
              title="Regenerate summary"
              id="regenerate-summary-btn"
            >
              {generating ? <span className="spinner spinner-sm" /> : (
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5A4.5 4.5 0 1 1 6.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M2 9.5V6.5H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              Regenerate
            </button>
          )}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)' }}>
          {summary.overview}
        </p>
      </section>

      {/* Key Topics */}
      {summary.key_topics.length > 0 && (
        <section aria-labelledby="key-topics-heading">
          <h3 id="key-topics-heading" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Key Topics
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {summary.key_topics.map((topic) => (
              <span key={topic} className="topic-chip">{topic}</span>
            ))}
          </div>
        </section>
      )}

      {/* Chapters */}
      {summary.chapters.length > 0 && (
        <section aria-labelledby="chapters-heading">
          <h3 id="chapters-heading" style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Chapters
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {summary.chapters.map((chapter, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 14px',
                  background: 'var(--bg-tag)',
                  borderRadius: 'var(--radius-md)',
                  cursor: onChapterClick ? 'pointer' : 'default',
                  transition: 'background var(--transition)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => onChapterClick?.(chapter.start_time)}
                onMouseEnter={(e) => {
                  if (onChapterClick) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--primary-light)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-tag)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
                role={onChapterClick ? 'button' : undefined}
                tabIndex={onChapterClick ? 0 : undefined}
                onKeyDown={(e) => e.key === 'Enter' && onChapterClick?.(chapter.start_time)}
                aria-label={`Chapter: ${chapter.title} at ${formatDuration(chapter.start_time)}`}
              >
                {/* Chapter number */}
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{chapter.title}</span>
                    <span style={{
                      fontSize: 11,
                      color: 'var(--text-muted)',
                      background: 'var(--bg-card)',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontFamily: 'monospace',
                    }}>
                      {formatDuration(chapter.start_time)}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {chapter.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
