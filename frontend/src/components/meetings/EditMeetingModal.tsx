'use client';
import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { meetingsApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { MeetingListItem, MeetingDetail } from '@/lib/types';
import { SPEAKER_PALETTE } from '@/lib/utils';

interface Props {
  meeting: MeetingListItem | null;
  onClose: () => void;
  onSuccess: (meeting: MeetingDetail) => void;
}

export function EditMeetingModal({ meeting, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [participants, setParticipants] = useState<{ name: string; email: string; color: string }[]>([]);

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setDate(new Date(meeting.date).toISOString().slice(0, 16));
      setDuration(String(Math.round(meeting.duration_seconds / 60)));
      setParticipants(
        meeting.participants.map((p) => ({ name: p.name, email: p.email || '', color: p.color }))
      );
    }
  }, [meeting]);

  if (!meeting) return null;

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      { name: '', email: '', color: SPEAKER_PALETTE[prev.length % SPEAKER_PALETTE.length] },
    ]);
  };

  const updateParticipant = (i: number, field: string, value: string) => {
    setParticipants((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const removeParticipant = (i: number) => {
    setParticipants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return toast('Title is required', 'error');
    setLoading(true);
    try {
      const updated = await meetingsApi.update(meeting.id, {
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration_seconds: parseInt(duration || '0') * 60,
        participants: participants
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name, email: p.email || undefined, color: p.color })),
      });
      toast('Meeting updated!', 'success');
      onSuccess(updated);
      onClose();
    } catch {
      toast('Failed to update meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={!!meeting}
      onClose={onClose}
      title="Edit Meeting"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            id="edit-meeting-submit"
          >
            {loading ? <span className="spinner spinner-sm" /> : null}
            Save Changes
          </button>
        </>
      }
    >
      <div className="input-group">
        <label className="input-label" htmlFor="edit-meeting-title">Meeting Title</label>
        <input
          id="edit-meeting-title"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="input-group">
          <label className="input-label" htmlFor="edit-meeting-date">Date & Time</label>
          <input
            id="edit-meeting-date"
            type="datetime-local"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="edit-meeting-duration">Duration (min)</label>
          <input
            id="edit-meeting-duration"
            type="number"
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={1}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="input-label">Participants</span>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addParticipant}>+ Add</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {participants.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="color"
                value={p.color}
                onChange={(e) => updateParticipant(i, 'color', e.target.value)}
                style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
              />
              <input
                className="input"
                value={p.name}
                onChange={(e) => updateParticipant(i, 'name', e.target.value)}
                placeholder="Name"
                style={{ flex: 1.2 }}
              />
              <input
                className="input"
                value={p.email}
                onChange={(e) => updateParticipant(i, 'email', e.target.value)}
                placeholder="Email"
                type="email"
                style={{ flex: 1.5 }}
              />
              {participants.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => removeParticipant(i)}
                  style={{ color: 'var(--error)' }}
                  aria-label="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
