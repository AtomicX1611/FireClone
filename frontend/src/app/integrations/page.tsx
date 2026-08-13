import { Topbar } from '@/components/layout/Topbar';

const INTEGRATIONS = [
  { name: 'Zoom', desc: 'Auto-join Zoom calls and record meetings.', icon: '📹', status: 'coming_soon' },
  { name: 'Google Meet', desc: 'Connect Google Workspace for transcription.', icon: '🤝', status: 'coming_soon' },
  { name: 'Microsoft Teams', desc: 'Record and transcribe Teams meetings.', icon: '💼', status: 'coming_soon' },
  { name: 'Google Calendar', desc: 'Sync upcoming meetings automatically.', icon: '📅', status: 'coming_soon' },
  { name: 'Slack', desc: 'Get meeting summaries posted to channels.', icon: '💬', status: 'coming_soon' },
  { name: 'Salesforce', desc: 'Sync action items to CRM opportunities.', icon: '☁️', status: 'coming_soon' },
  { name: 'HubSpot', desc: 'Push meeting notes to HubSpot contacts.', icon: '🔶', status: 'coming_soon' },
  { name: 'Notion', desc: 'Export summaries to Notion pages.', icon: '📝', status: 'coming_soon' },
  { name: 'Jira', desc: 'Create Jira issues from action items.', icon: '🎯', status: 'coming_soon' },
];

export default function IntegrationsPage() {
  return (
    <>
      <Topbar title="Integrations" />
      <div className="page-container">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 560 }}>
          Connect Fireflies to your existing tools to automatically capture, share, and act on your meeting data.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {INTEGRATIONS.map((item) => (
            <div key={item.name} className="card" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.name}</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{item.desc}</p>
                <button className="btn btn-ghost btn-sm" disabled style={{ cursor: 'not-allowed', opacity: 0.7 }}>
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
