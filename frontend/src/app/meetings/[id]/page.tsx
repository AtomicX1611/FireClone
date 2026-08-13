'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/Topbar';
import { AudioPlayer } from '@/components/transcript/AudioPlayer';
import { TranscriptView } from '@/components/transcript/TranscriptView';
import { SummaryPanel } from '@/components/summary/SummaryPanel';
import { ActionItems } from '@/components/summary/ActionItems';
import { UploadTranscriptModal } from '@/components/transcript/UploadTranscriptModal';
import { EditMeetingModal } from '@/components/meetings/EditMeetingModal';
import { Modal } from '@/components/ui/Modal';
import { AvatarStack } from '@/components/ui/Avatar';
import { meetingsApi, transcriptApi, summaryApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { MeetingDetail, TranscriptSegment, MeetingTab, ActionItem, MeetingListItem } from '@/lib/types';
import { formatDateTime, formatDurationLabel } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

export default function MeetingDetailPage({ params }: Props) {
  const { id } = use(params);
  const meetingId = parseInt(id);
  const router = useRouter();
  const { toast } = useToast();

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MeetingTab>('summary');
  const [currentTime, setCurrentTime] = useState(0);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [meetingData, segmentData] = await Promise.all([
          meetingsApi.get(meetingId),
          transcriptApi.get(meetingId),
        ]);
        setMeeting(meetingData);
        setSegments(segmentData);
      } catch {
        toast('Failed to load meeting', 'error');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [meetingId]); // eslint-disable-line

  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const summary = await summaryApi.generate(meetingId);
      setMeeting((m) => m ? { ...m, summary } : m);
      toast('Summary generated!', 'success');
    } catch {
      toast('Failed to generate summary', 'error');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await meetingsApi.delete(meetingId);
      toast('Meeting deleted', 'info');
      router.push('/');
    } catch {
      toast('Failed to delete meeting', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Topbar title="Loading…" />
        <div className="page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span className="spinner spinner-lg" />
            <span style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>Loading meeting…</span>
          </div>
        </div>
      </>
    );
  }

  if (!meeting) return null;

  return (
    <>
      <Topbar
        title={meeting.title}
        actions={
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setUploadOpen(true)}
              id="upload-transcript-btn"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v8M4 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10v2h10v-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Upload Transcript
            </button>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => setEditOpen(true)}
              title="Edit meeting"
              id="edit-meeting-detail-btn"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M11 1.5L13.5 4L6 11.5H3.5V9L11 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => setDeleteOpen(true)}
              title="Delete meeting"
              style={{ color: 'var(--error)' }}
              id="delete-meeting-detail-btn"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M2 4h11M5 4V3h5v1M5.5 6.5v5M9.5 6.5v5M2.5 4l.75 9h8.5l.75-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="btn btn-ghost btn-icon btn-sm"
              onClick={() => router.push('/')}
              title="Back to meetings"
              id="back-to-meetings-btn"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M10 12L5 7.5L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        }
      />

      <div className="page-container" style={{ maxWidth: 1200 }}>
        {/* Meeting metadata bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <AvatarStack participants={meeting.participants} max={5} size="md" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>
              {meeting.participants.map((p) => p.name).join(', ')}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12.5, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <span>📅 {formatDateTime(meeting.date)}</span>
              <span>⏱ {formatDurationLabel(meeting.duration_seconds)}</span>
              <span>🎙 {segments.length} segments</span>
            </div>
          </div>
          {meeting.summary && (
            <span className="badge badge-success">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              AI Summary Ready
            </span>
          )}
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, alignItems: 'start' }}>

          {/* Left: Notepad (tabs + content) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Tabs */}
            <div className="tabs">
              {([
                { id: 'summary', label: 'Summary' },
                { id: 'transcript', label: 'Transcript' },
                { id: 'action-items', label: `Tasks (${meeting.action_items.length})` },
              ] as { id: MeetingTab; label: string }[]).map(({ id: tabId, label }) => (
                <button
                  key={tabId}
                  className={`tab ${activeTab === tabId ? 'active' : ''}`}
                  onClick={() => setActiveTab(tabId)}
                  id={`tab-${tabId}`}
                  aria-selected={activeTab === tabId}
                  role="tab"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="card" style={{ padding: '20px 22px', minHeight: 400 }}>
              {activeTab === 'summary' && (
                <SummaryPanel
                  summary={meeting.summary}
                  onChapterClick={(time) => {
                    setCurrentTime(time);
                    setActiveTab('transcript');
                  }}
                  onGenerate={handleGenerateSummary}
                  generating={generatingSummary}
                />
              )}

              {activeTab === 'transcript' && (
                <TranscriptView
                  segments={segments}
                  meetingId={meetingId}
                  currentTime={currentTime}
                  onSegmentClick={(time) => setCurrentTime(time)}
                />
              )}

              {activeTab === 'action-items' && (
                <ActionItems
                  meetingId={meetingId}
                  items={meeting.action_items}
                  onChange={(items: ActionItem[]) =>
                    setMeeting((m) => m ? { ...m, action_items: items } : m)
                  }
                />
              )}
            </div>
          </div>

          {/* Right: Player + quick info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, position: 'sticky', top: 80 }}>
            {/* Audio Player */}
            <AudioPlayer
              meetingTitle={meeting.title}
              duration={meeting.duration_seconds}
              currentTime={currentTime}
              onSeek={(time) => setCurrentTime(time)}
              onTimeUpdate={(time) => setCurrentTime(time)}
            />

            {/* Participants list */}
            <div className="card" style={{ padding: '16px 18px' }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                Participants ({meeting.participants.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {meeting.participants.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: p.color, color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 600, flexShrink: 0,
                    }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      {p.email && (
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{p.email}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="card" style={{ padding: '14px 18px' }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Quick Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Duration', value: formatDurationLabel(meeting.duration_seconds) },
                  { label: 'Segments', value: String(segments.length) },
                  { label: 'Action Items', value: `${meeting.action_items.filter(a => a.completed).length}/${meeting.action_items.length} done` },
                  { label: 'Topics', value: meeting.summary ? `${meeting.summary.key_topics.length} topics` : 'No summary' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadTranscriptModal
        isOpen={uploadOpen}
        meetingId={meetingId}
        onClose={() => setUploadOpen(false)}
        onSuccess={(newSegments) => setSegments(newSegments)}
      />

      <EditMeetingModal
        meeting={meeting as unknown as MeetingListItem}
        onClose={() => setEditOpen(false)}
        onSuccess={(updated) => setMeeting(updated)}
      />

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Meeting"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
              id="confirm-delete-detail-btn"
            >
              {deleting ? <span className="spinner spinner-sm" /> : null}
              Delete Meeting
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Are you sure you want to delete <strong>{meeting.title}</strong>? This will permanently remove the transcript, summary, and all action items.
        </p>
      </Modal>
    </>
  );
}
