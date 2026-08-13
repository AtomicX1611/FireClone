'use client';
import { useState } from 'react';
import type { ActionItem } from '@/lib/types';
import { actionItemsApi } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { formatDate } from '@/lib/utils';

interface ActionItemsProps {
  meetingId: number;
  items: ActionItem[];
  onChange: (items: ActionItem[]) => void;
}

export function ActionItems({ meetingId, items, onChange }: ActionItemsProps) {
  const { toast } = useToast();
  const [newText, setNewText] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDue, setNewDue] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const addItem = async () => {
    if (!newText.trim()) return;
    setAdding(true);
    try {
      const item = await actionItemsApi.create(meetingId, {
        text: newText.trim(),
        assignee: newAssignee.trim() || undefined,
        due_date: newDue || undefined,
      });
      onChange([...items, item]);
      setNewText('');
      setNewAssignee('');
      setNewDue('');
      setShowForm(false);
      toast('Action item added!', 'success');
    } catch {
      toast('Failed to add action item', 'error');
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (item: ActionItem) => {
    try {
      const updated = await actionItemsApi.update(item.id, { completed: !item.completed });
      onChange(items.map((i) => (i.id === item.id ? updated : i)));
    } catch {
      toast('Failed to update action item', 'error');
    }
  };

  const saveEdit = async (item: ActionItem) => {
    if (!editText.trim()) return;
    try {
      const updated = await actionItemsApi.update(item.id, { text: editText.trim() });
      onChange(items.map((i) => (i.id === item.id ? updated : i)));
      setEditingId(null);
      toast('Updated!', 'success');
    } catch {
      toast('Failed to update', 'error');
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await actionItemsApi.delete(id);
      onChange(items.filter((i) => i.id !== id));
      toast('Action item deleted', 'info');
    } catch {
      toast('Failed to delete', 'error');
    }
  };

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600 }}>Action Items</h3>
          {total > 0 && (
            <span className="badge badge-muted">{completed}/{total} done</span>
          )}
        </div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowForm((s) => !s)}
          id="add-action-item-btn"
        >
          + Add Task
        </button>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: 'var(--success)',
              width: `${(completed / total) * 100}%`,
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div style={{
          background: 'var(--bg-tag)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <input
            className="input"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Action item description…"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            id="action-item-text-input"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input
              className="input"
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              placeholder="Assignee (optional)"
            />
            <input
              type="date"
              className="input"
              value={newDue}
              onChange={(e) => setNewDue(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setShowForm(false); setNewText(''); }}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={addItem} disabled={adding || !newText.trim()}>
              {adding ? <span className="spinner spinner-sm" /> : 'Add Task'}
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      {items.length === 0 && !showForm ? (
        <div className="empty-state" style={{ padding: '32px 16px' }}>
          <div className="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M7 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8l-5-5H7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="empty-state-title">No action items yet</p>
          <p className="empty-state-desc">Add tasks from this meeting to track follow-ups</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item) => (
            <div key={item.id} className="action-item" id={`action-item-${item.id}`}>
              {/* Checkbox */}
              <button
                className={`action-item-checkbox ${item.completed ? 'checked' : ''}`}
                onClick={() => toggleComplete(item)}
                aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
                aria-pressed={item.completed}
              >
                {item.completed && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M9 2L4 8L1 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === item.id ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      className="input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(item);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      style={{ flex: 1 }}
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(item)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <p className={`action-item-text ${item.completed ? 'completed' : ''}`}>
                      {item.text}
                    </p>
                    <div className="action-item-meta">
                      {item.assignee && (
                        <span style={{ fontSize: 11.5, color: 'var(--primary)', background: 'var(--primary-light)', padding: '1px 8px', borderRadius: 'var(--radius-full)' }}>
                          @{item.assignee}
                        </span>
                      )}
                      {item.due_date && (
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          Due {formatDate(item.due_date)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {editingId !== item.id && (
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => { setEditingId(item.id); setEditText(item.text); }}
                    aria-label="Edit action item"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M9 1.5L11.5 4L4.5 11H2V8.5L9 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => deleteItem(item.id)}
                    aria-label="Delete action item"
                    style={{ color: 'var(--error)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M2 3.5h9M4 3.5V2.5h5v1M4.5 5.5v4M8.5 5.5v4M2.5 3.5l.5 8h7l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
