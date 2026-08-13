'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { meetingsApi, transcriptApi } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import type { TranscriptSearchResult } from '@/lib/types';
import { formatDuration } from '@/lib/utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [meetingId, setMeetingId] = useState<number | ''>('');
  const [results, setResults] = useState<TranscriptSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState<{ id: number; title: string }[]>([]);
  const debouncedQuery = useDebounce(query, 400);
  const router = useRouter();

  useEffect(() => {
    meetingsApi.list({ page_size: 50 }).then((r) =>
      setMeetings(r.items.map((m) => ({ id: m.id, title: m.title })))
    );
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim() || !meetingId) {
      setResults([]);
      return;
    }
    setLoading(true);
    transcriptApi
      .search(meetingId as number, debouncedQuery)
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery, meetingId]);

  return (
    <>
      <Topbar title="Search" />
      <div className="page-container">
        <div style={{ maxWidth: 720 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Search within a meeting's transcript to find specific moments, speakers, or topics.
          </p>

          {/* Search controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <select
                className="input"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value ? Number(e.target.value) : '')}
                id="search-meeting-select"
              >
                <option value="">Select a meeting…</option>
                {meetings.map((m) => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </select>
            </div>
            <div className="search-bar" style={{ flex: 2, minWidth: 200 }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input
                id="global-search-input"
                type="text"
                placeholder="Search transcript…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={!meetingId}
              />
              {loading && <span className="spinner spinner-sm" />}
            </div>
          </div>

          {/* Results */}
          {!meetingId && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 32 }}>🔍</div>
              <p className="empty-state-title">Select a meeting to search</p>
              <p className="empty-state-desc">Choose a meeting from the dropdown above, then type to search its transcript</p>
            </div>
          )}

          {meetingId && !query && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 32 }}>💬</div>
              <p className="empty-state-title">Start typing to search</p>
              <p className="empty-state-desc">Search for keywords, speaker names, or topics in the transcript</p>
            </div>
          )}

          {query && results.length === 0 && !loading && meetingId && (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 32 }}>😕</div>
              <p className="empty-state-title">No matches found</p>
              <p className="empty-state-desc">Try different keywords or check another meeting</p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                {results.length} match{results.length !== 1 ? 'es' : ''} found
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {results.map((r) => (
                  <div
                    key={r.segment_id}
                    className="card card-hover"
                    style={{ padding: '14px 16px', cursor: 'pointer' }}
                    onClick={() => router.push(`/meetings/${meetingId}?t=${r.start_time}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.speaker_color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: r.speaker_color }}>{r.speaker_name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', background: 'var(--bg-tag)', padding: '1px 6px', borderRadius: 4 }}>
                        {formatDuration(r.start_time)}
                      </span>
                    </div>
                    <p
                      style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}
                      dangerouslySetInnerHTML={{ __html: r.highlight }}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
