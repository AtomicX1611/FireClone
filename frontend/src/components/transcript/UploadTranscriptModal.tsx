'use client';
import { useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { transcriptApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import type { TranscriptSegment } from '@/lib/types';

interface Props {
  isOpen: boolean;
  meetingId: number;
  onClose: () => void;
  onSuccess: (segments: TranscriptSegment[]) => void;
}

export function UploadTranscriptModal({ isOpen, meetingId, onClose, onSuccess }: Props) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const segments = await transcriptApi.upload(meetingId, file);
      toast(`Uploaded ${segments.length} transcript segments!`, 'success');
      onSuccess(segments);
      onClose();
      setFile(null);
    } catch {
      toast('Failed to upload transcript', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Transcript"
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={loading || !file}
            id="upload-transcript-submit"
          >
            {loading ? <span className="spinner spinner-sm" /> : null}
            Upload
          </button>
        </>
      }
    >
      <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Upload a transcript file to add it to this meeting. Supported formats: <code>.txt</code>, <code>.vtt</code>, <code>.json</code>
      </p>

      {/* Drop zone */}
      <div
        style={{
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all var(--transition)',
          background: file ? 'var(--primary-light)' : 'var(--bg-tag)',
          borderColor: file ? 'var(--primary)' : 'var(--border)',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files[0];
          if (dropped) setFile(dropped);
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ color: 'var(--primary)', margin: '0 auto' }}>
            <path d="M16 6V22M16 6L11 11M16 6L21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 22v4h20v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        {file ? (
          <>
            <p style={{ fontWeight: 600, fontSize: 14 }}>{file.name}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{(file.size / 1024).toFixed(1)} KB</p>
          </>
        ) : (
          <>
            <p style={{ fontWeight: 500, fontSize: 14 }}>Drop file here or click to browse</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>.txt, .vtt, .json</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.vtt,.json"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          id="transcript-file-input"
        />
      </div>
    </Modal>
  );
}
