'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { TranscriptSegment } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { transcriptApi } from '@/lib/api';

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  meetingId: number;
  currentTime?: number;
  onSegmentClick?: (time: number) => void;
}

export function TranscriptView({ segments, meetingId, currentTime = 0, onSegmentClick }: TranscriptViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [searchResults, setSearchResults] = useState<number[]>([]); // segment ids with matches
  const [searchLoading, setSearchLoading] = useState(false);
  const activeRef = useRef<HTMLDivElement>(null);

  // Find active segment based on currentTime
  const activeSegmentId = segments.reduce<number | null>((found, seg) => {
    if (currentTime >= seg.start_time && currentTime <= seg.end_time) return seg.id;
    return found;
  }, null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSegmentId]);

  // Search within transcript
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    transcriptApi
      .search(meetingId, debouncedSearch)
      .then((results) => {
        setSearchResults(results.map((r) => r.segment_id));
      })
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, [debouncedSearch, meetingId]);

  const highlightText = useCallback(
    (text: string): { __html: string } => {
      if (!debouncedSearch.trim()) return { __html: text };
      const escaped = debouncedSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const highlighted = text.replace(
        new RegExp(escaped, 'gi'),
        (m) => `<mark>${m}</mark>`,
      );
      return { __html: highlighted };
    },
    [debouncedSearch],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Search within transcript */}
      <div className="search-bar" style={{ marginBottom: 4 }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
        <input
          id="transcript-search"
          type="text"
          placeholder="Search in transcript…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search transcript"
        />
        {searchLoading && <span className="spinner spinner-sm" />}
        {searchQuery && !searchLoading && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {searchResults.length} match{searchResults.length !== 1 ? 'es' : ''}
          </span>
        )}
        {searchQuery && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSearchQuery('')}
            style={{ padding: '2px 6px', fontSize: 11 }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Segments */}
      <div role="list" aria-label="Transcript segments">
        {segments.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 16px' }}>
            <div className="empty-state-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6M9 16h4M7 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="empty-state-title">No transcript yet</p>
            <p className="empty-state-desc">Upload a transcript file to get started</p>
          </div>
        ) : (
          segments.map((seg) => {
            const isActive = seg.id === activeSegmentId;
            const isHighlighted = searchResults.includes(seg.id);
            return (
              <div
                key={seg.id}
                ref={isActive ? activeRef : undefined}
                className={`transcript-line ${isActive ? 'active' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => onSegmentClick?.(seg.start_time)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSegmentClick?.(seg.start_time)}
                aria-label={`${seg.speaker_name} at ${formatDuration(seg.start_time)}: ${seg.text}`}
              >
                <div
                  className="transcript-speaker-dot"
                  style={{ background: seg.speaker_color }}
                />
                <div className="transcript-content">
                  <div className="transcript-meta">
                    <span
                      className="transcript-speaker"
                      style={{ color: seg.speaker_color }}
                    >
                      {seg.speaker_name}
                    </span>
                    <span
                      className="transcript-timestamp"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSegmentClick?.(seg.start_time);
                      }}
                      title={`Seek to ${formatDuration(seg.start_time)}`}
                    >
                      {formatDuration(seg.start_time)}
                    </span>
                  </div>
                  <p
                    className="transcript-text"
                    dangerouslySetInnerHTML={highlightText(seg.text)}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
