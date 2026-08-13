import type {
  PaginatedMeetings,
  MeetingDetail,
  MeetingListItem,
  TranscriptSegment,
  MeetingSummary,
  ActionItem,
  TranscriptSearchResult,
  CreateMeetingPayload,
  UpdateMeetingPayload,
  CreateActionItemPayload,
  UpdateActionItemPayload,
  SortField,
  SortOrder,
} from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
  ) {
    super(detail);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {}
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

export interface ListMeetingsParams {
  q?: string;
  participant?: string;
  sort_by?: SortField;
  order?: SortOrder;
  page?: number;
  page_size?: number;
}

export const meetingsApi = {
  list: (params: ListMeetingsParams = {}): Promise<PaginatedMeetings> => {
    const qs = new URLSearchParams();
    if (params.q) qs.set('q', params.q);
    if (params.participant) qs.set('participant', params.participant);
    if (params.sort_by) qs.set('sort_by', params.sort_by);
    if (params.order) qs.set('order', params.order);
    if (params.page) qs.set('page', String(params.page));
    if (params.page_size) qs.set('page_size', String(params.page_size));
    return request<PaginatedMeetings>(`/api/meetings?${qs.toString()}`);
  },

  get: (id: number): Promise<MeetingDetail> =>
    request<MeetingDetail>(`/api/meetings/${id}`),

  create: (payload: CreateMeetingPayload): Promise<MeetingDetail> =>
    request<MeetingDetail>('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateMeetingPayload): Promise<MeetingDetail> =>
    request<MeetingDetail>(`/api/meetings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (id: number): Promise<void> =>
    request<void>(`/api/meetings/${id}`, { method: 'DELETE' }),
};

// ─── Transcripts ──────────────────────────────────────────────────────────────

export const transcriptApi = {
  get: (meetingId: number): Promise<TranscriptSegment[]> =>
    request<TranscriptSegment[]>(`/api/meetings/${meetingId}/transcript`),

  search: (meetingId: number, q: string): Promise<TranscriptSearchResult[]> => {
    const qs = new URLSearchParams({ q });
    return request<TranscriptSearchResult[]>(
      `/api/meetings/${meetingId}/transcript/search?${qs.toString()}`,
    );
  },

  upload: (meetingId: number, file: File): Promise<TranscriptSegment[]> => {
    const form = new FormData();
    form.append('file', file);
    return request<TranscriptSegment[]>(
      `/api/meetings/${meetingId}/transcript/upload`,
      {
        method: 'POST',
        headers: {},  // let browser set multipart boundary
        body: form,
      },
    );
  },
};

// ─── Summaries ────────────────────────────────────────────────────────────────

export const summaryApi = {
  get: (meetingId: number): Promise<MeetingSummary> =>
    request<MeetingSummary>(`/api/meetings/${meetingId}/summary`),

  generate: (meetingId: number): Promise<MeetingSummary> =>
    request<MeetingSummary>(`/api/meetings/${meetingId}/summary/generate`, {
      method: 'POST',
    }),
};

// ─── Action Items ─────────────────────────────────────────────────────────────

export const actionItemsApi = {
  list: (meetingId: number): Promise<ActionItem[]> =>
    request<ActionItem[]>(`/api/meetings/${meetingId}/action-items`),

  create: (meetingId: number, payload: CreateActionItemPayload): Promise<ActionItem> =>
    request<ActionItem>(`/api/meetings/${meetingId}/action-items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (itemId: number, payload: UpdateActionItemPayload): Promise<ActionItem> =>
    request<ActionItem>(`/api/action-items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  delete: (itemId: number): Promise<void> =>
    request<void>(`/api/action-items/${itemId}`, { method: 'DELETE' }),
};

export { ApiError };
