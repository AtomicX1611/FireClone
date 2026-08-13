'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { meetingsApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { MeetingDetail } from '@/lib/types';
import { SPEAKER_PALETTE } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (meeting: MeetingDetail) => void;
}

interface ParticipantInput {
  name: string;
  email: string;
  color: string;
}

export function CreateMeetingModal({ isOpen, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [duration, setDuration] = useState('60');
  const [participants, setParticipants] = useState<ParticipantInput[]>([
    { name: '', email: '', color: SPEAKER_PALETTE[0] },
  ]);

  const addParticipant = () => {
    setParticipants((prev) => [
      ...prev,
      { name: '', email: '', color: SPEAKER_PALETTE[prev.length % SPEAKER_PALETTE.length] },
    ]);
  };

  const updateParticipant = (i: number, field: keyof ParticipantInput, value: string) => {
    setParticipants((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const removeParticipant = (i: number) => {
    setParticipants((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast('Meeting title is required', 'error');

    setLoading(true);
    try {
      const meeting = await meetingsApi.create({
        title: title.trim(),
        date: new Date(date).toISOString(),
        duration_seconds: parseInt(duration || '0') * 60,
        participants: participants
          .filter((p) => p.name.trim())
          .map((p) => ({ name: p.name.trim(), email: p.email || undefined, color: p.color })),
      });
      toast('Meeting created!', 'success');
      onSuccess(meeting);
      handleClose();
    } catch {
      toast('Failed to create meeting', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDate(new Date().toISOString().slice(0, 16));
    setDuration('60');
    setParticipants([{ name: '', email: '', color: SPEAKER_PALETTE[0] }]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Meeting"
      footer={
        <>
          <button className="btn btn-ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit as React.MouseEventHandler}
            disabled={loading || !title.trim()}
            id="create-meeting-submit"
          >
            {loading ? <span className="spinner spinner-sm" /> : null}
            Create Meeting
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
        {/* Title */}
        <div className="input-group">
          <label className="input-label" htmlFor="meeting-title">Meeting Title *</label>
          <input
            id="meeting-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q3 Sprint Planning"
            autoFocus
            required
          />
        </div>

        {/* Date & Duration row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="input-group">
            <label className="input-label" htmlFor="meeting-date">Date & Time</label>
            <input
              id="meeting-date"
              type="datetime-local"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="meeting-duration">Duration (minutes)</label>
            <input
              id="meeting-duration"
              type="number"
              className="input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={1}
              placeholder="60"
            />
          </div>
        </div>

        {/* Participants */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="input-label">Participants</span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addParticipant}
            >
              + Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {participants.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {/* Color swatch */}
                <input
                  type="color"
                  value={p.color}
                  onChange={(e) => updateParticipant(i, 'color', e.target.value)}
                  style={{ width: 32, height: 32, border: 'none', background: 'none', padding: 0, cursor: 'pointer', borderRadius: 6 }}
                  title="Participant color"
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
                  placeholder="Email (optional)"
                  type="email"
                  style={{ flex: 1.5 }}
                />
                {participants.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => removeParticipant(i)}
                    style={{ color: 'var(--error)', flexShrink: 0 }}
                    aria-label="Remove participant"
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
      </form>
    </Modal>
  );
}
