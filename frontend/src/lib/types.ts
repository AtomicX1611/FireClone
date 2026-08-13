// API base types matching the backend Pydantic schemas

export interface Participant {
  id: number;
  meeting_id: number;
  name: string;
  email: string | null;
  color: string;
}

export interface TranscriptSegment {
  id: number;
  meeting_id: number;
  speaker_name: string;
  speaker_color: string;
  start_time: number;
  end_time: number;
  text: string;
  sequence: number;
}

export interface Chapter {
  title: string;
  start_time: number;
  summary: string;
}

export interface MeetingSummary {
  id: number;
  meeting_id: number;
  overview: string;
  key_topics: string[];
  chapters: Chapter[];
  created_at: string;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: Participant[];
  action_items_count: number;
  completed_action_items_count: number;
  has_summary: boolean;
  created_at: string;
  updated_at: string;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  participants: Participant[];
  summary: MeetingSummary | null;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedMeetings {
  items: MeetingListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface TranscriptSearchResult {
  segment_id: number;
  speaker_name: string;
  speaker_color: string;
  start_time: number;
  text: string;
  sequence: number;
  highlight: string;
}

// ─── Request types ──────────────────────────────────────────────────────────────

export interface CreateMeetingPayload {
  title: string;
  date: string;
  duration_seconds: number;
  participants: { name: string; email?: string; color: string }[];
}

export interface UpdateMeetingPayload {
  title?: string;
  date?: string;
  duration_seconds?: number;
  participants?: { name: string; email?: string; color: string }[];
}

export interface CreateActionItemPayload {
  text: string;
  assignee?: string;
  due_date?: string;
  completed?: boolean;
}

export interface UpdateActionItemPayload {
  text?: string;
  assignee?: string;
  due_date?: string;
  completed?: boolean;
}

// ─── UI helpers ──────────────────────────────────────────────────────────────────

export type SortField = 'date' | 'title' | 'duration';
export type SortOrder = 'asc' | 'desc';
export type MeetingTab = 'summary' | 'transcript' | 'action-items';
