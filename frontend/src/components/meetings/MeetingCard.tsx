'use client';
import { useRouter } from 'next/navigation';
import type { MeetingListItem } from '@/lib/types';
import { AvatarStack } from '@/components/ui/Avatar';
import { formatDate, formatDurationLabel, formatRelative } from '@/lib/utils';

interface MeetingCardProps {
  meeting: MeetingListItem;
  onDelete?: (id: number) => void;
  onEdit?: (meeting: MeetingListItem) => void;
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M1 5h11" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4 1v2M9 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M6.5 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M10 3L5 9L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function MeetingCard({ meeting, onDelete, onEdit }: MeetingCardProps) {
  const router = useRouter();
  const completedRatio = meeting.action_items_count > 0
    ? meeting.completed_action_items_count / meeting.action_items_count
    : null;

  return (
    <article
      className="meeting-card"
      onClick={() => router.push(`/meetings/${meeting.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && router.push(`/meetings/${meeting.id}`)}
      aria-label={`Open meeting: ${meeting.title}`}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <h3 className="meeting-card-title" style={{ flex: 1 }}>{meeting.title}</h3>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {onEdit && (
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={(e) => { e.stopPropagation(); onEdit(meeting); }}
              aria-label="Edit meeting"
              title="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 1.5L12.5 4L5 11.5H2.5V9L10 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={(e) => { e.stopPropagation(); onDelete(meeting.id); }}
              aria-label="Delete meeting"
              title="Delete"
              style={{ color: 'var(--error)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.75 8h6.5l.75-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="meeting-card-meta">
        <span className="meeting-card-meta-item">
          <CalendarIcon />
          {formatDate(meeting.date)}
        </span>
        <span className="meeting-card-meta-item">
          <ClockIcon />
          {formatDurationLabel(meeting.duration_seconds)}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
          {formatRelative(meeting.date)}
        </span>
      </div>

      {/* Footer */}
      <div className="meeting-card-footer">
        {/* Participants */}
        <AvatarStack
          participants={meeting.participants}
          max={4}
          size="sm"
        />

        {/* Right side badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {meeting.has_summary && (
            <span className="badge badge-primary" title="AI summary available">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 3h8M1 6h5M1 8.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Summary
            </span>
          )}
          {meeting.action_items_count > 0 && (
            <span
              className={`badge ${completedRatio === 1 ? 'badge-success' : 'badge-muted'}`}
              title={`${meeting.completed_action_items_count}/${meeting.action_items_count} action items done`}
            >
              <CheckIcon />
              {meeting.completed_action_items_count}/{meeting.action_items_count}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
