import { Topbar } from '@/components/layout/Topbar';

export default function TeamPage() {
  return (
    <>
      <Topbar title="Team" />
      <div className="page-container">
        <div className="empty-state" style={{ paddingTop: 64 }}>
          <div className="empty-state-icon" style={{ width: 72, height: 72 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="14" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="26" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M2 30c0-5.523 5.373-10 12-10s12 4.477 12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M26 20c3.314 0 6 2.686 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="empty-state-title">Team Collaboration</p>
          <p className="empty-state-desc" style={{ maxWidth: 400 }}>
            Invite teammates to shared workspaces, collaborate on meeting notes, and manage team permissions.
            Full team features are coming soon.
          </p>
          <span className="badge badge-muted" style={{ marginTop: 8 }}>Coming Soon</span>
        </div>
      </div>
    </>
  );
}
