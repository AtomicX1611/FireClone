'use client';
import { useEffect, useState, useCallback } from 'react';
import { Topbar } from '@/components/layout/Topbar';
import { MeetingCard } from '@/components/meetings/MeetingCard';
import { CreateMeetingModal } from '@/components/meetings/CreateMeetingModal';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { Modal } from '@/components/ui/Modal';
import { meetingsApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useDebounce } from '@/hooks/useDebounce';
import type { MeetingListItem, MeetingDetail, SortField, SortOrder } from '@/lib/types';

type ViewMode = 'grid' | 'list';

export default function DashboardPage() {
  const { toast } = useToast();
  const [meetings, setMeetings] = useState<MeetingListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [participantFilter, setParticipantFilter] = useState('');
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const debouncedParticipant = useDebounce(participantFilter, 400);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editMeeting, setEditMeeting] = useState<MeetingListItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const result = await meetingsApi.list({
        q: debouncedSearch || undefined,
        participant: debouncedParticipant || undefined,
        sort_by: sortBy,
        order: sortOrder,
        page,
        page_size: 9,
      });
      setMeetings(result.items);
      setTotal(result.total);
      setTotalPages(result.total_pages);
    } catch {
      toast('Failed to load meetings', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, debouncedParticipant, sortBy, sortOrder, page, toast]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, debouncedParticipant, sortBy, sortOrder]);

  const handleCreateSuccess = (meeting: MeetingDetail) => {
    fetchMeetings();
    toast('Meeting created successfully!', 'success');
  };

  const handleEditSuccess = () => {
    fetchMeetings();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await meetingsApi.delete(deleteId);
      toast('Meeting deleted', 'info');
      setDeleteId(null);
      fetchMeetings();
    } catch {
      toast('Failed to delete meeting', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return null;
    return (
      <span style={{ marginLeft: 4, fontSize: 10 }}>
        {sortOrder === 'desc' ? '↓' : '↑'}
      </span>
    );
  };

  return (
    <>
      <Topbar
        title="Meetings"
        actions={
          <button
            className="btn btn-primary"
            onClick={() => setCreateOpen(true)}
            id="new-meeting-btn"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New Meeting
          </button>
        }
      />

      <div className="page-container">
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Meetings', value: total, icon: '📋' },
            { label: 'This Week', value: meetings.filter(m => {
              const d = new Date(m.date);
              const now = new Date();
              const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length, icon: '📅' },
            { label: 'With Summaries', value: meetings.filter(m => m.has_summary).length, icon: '✨' },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 24 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input
              id="meeting-search"
              type="text"
              placeholder="Search meetings…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search meetings"
            />
            {searchQuery && (
              <button className="btn btn-ghost btn-sm" onClick={() => setSearchQuery('')} style={{ padding: '2px 6px' }}>×</button>
            )}
          </div>

          {/* Participant filter */}
          <div className="search-bar" style={{ width: 200 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
              <circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M1 12c0-2.209 2.686-4 6-4s6 1.791 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              id="participant-filter"
              type="text"
              placeholder="Filter by participant…"
              value={participantFilter}
              onChange={(e) => setParticipantFilter(e.target.value)}
            />
          </div>

          {/* Sort controls */}
          <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 3 }}>
            {(['date', 'title', 'duration'] as SortField[]).map((field) => (
              <button
                key={field}
                className={`btn btn-sm ${sortBy === field ? 'btn-secondary' : 'btn-ghost'}`}
                onClick={() => toggleSort(field)}
                style={{ textTransform: 'capitalize', minWidth: 68 }}
                id={`sort-${field}-btn`}
              >
                {field} <SortIndicator field={field} />
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              className={`btn btn-icon btn-sm ${viewMode === 'grid' ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            </button>
            <button
              className={`btn btn-icon btn-sm ${viewMode === 'list' ? 'btn-secondary' : 'btn-ghost'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 3h9M3 7h9M3 11h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                <circle cx="1" cy="3" r="0.7" fill="currentColor"/>
                <circle cx="1" cy="7" r="0.7" fill="currentColor"/>
                <circle cx="1" cy="11" r="0.7" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <span className="spinner spinner-lg" />
              <span style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>Loading meetings…</span>
            </div>
          </div>
        ) : meetings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2.5" y="3.5" width="23" height="21" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M8 9h12M8 14h8M8 19h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="empty-state-title">
              {searchQuery || participantFilter ? 'No meetings found' : 'No meetings yet'}
            </p>
            <p className="empty-state-desc">
              {searchQuery || participantFilter
                ? 'Try adjusting your search or filters'
                : 'Create your first meeting to get started'}
            </p>
            {!searchQuery && !participantFilter && (
              <button className="btn btn-primary" onClick={() => setCreateOpen(true)} style={{ marginTop: 12 }}>
                + New Meeting
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Count */}
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
              Showing {meetings.length} of {total} meeting{total !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'flex',
              gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(320px, 1fr))' : undefined,
              flexDirection: viewMode === 'list' ? 'column' : undefined,
              gap: 14,
            }}>
              {meetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={(m) => setEditMeeting(m)}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 28, alignItems: 'center' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPage(p)}
                    style={{ minWidth: 36 }}
                    aria-current={p === page ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <CreateMeetingModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <EditMeetingModal
        meeting={editMeeting}
        onClose={() => setEditMeeting(null)}
        onSuccess={handleEditSuccess}
      />

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Meeting"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              id="confirm-delete-meeting-btn"
            >
              {deleting ? <span className="spinner spinner-sm" /> : null}
              Delete Meeting
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Are you sure you want to delete this meeting? This will permanently remove the transcript, summary, and all action items. This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
