import type { Metadata } from 'next';
import { Topbar } from '@/components/layout/Topbar';

export const metadata: Metadata = {
  title: 'Settings — Fireflies',
  description: 'Manage your Fireflies account settings, integrations, and preferences.',
};

function ComingSoonCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ fontSize: 24, flexShrink: 0 }}>{icon}</div>
      <div>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>{title}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
        <span className="badge badge-muted" style={{ marginTop: 8 }}>Coming Soon</span>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" />
      <div className="page-container">
        <div style={{ maxWidth: 680 }}>
          {/* Profile */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Profile
            </h2>
            <div className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                  AJ
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Alex Johnson</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>alex@acme.com</div>
                  <span className="badge badge-primary" style={{ marginTop: 4 }}>Pro Plan</span>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input className="input" defaultValue="Alex Johnson" disabled style={{ color: 'var(--text-secondary)' }} />
                </div>
                <div className="input-group">
                  <label className="input-label">Email</label>
                  <input className="input" defaultValue="alex@acme.com" disabled style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                Profile editing requires real authentication — placeholder for demo.
              </p>
            </div>
          </section>

          {/* Notifications */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Notifications</h2>
            <ComingSoonCard
              icon="🔔"
              title="Email Notifications"
              description="Get notified when meetings are transcribed, summaries are ready, or action items are due."
            />
          </section>

          {/* Integrations */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Integrations</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '📹', title: 'Zoom Integration', desc: 'Auto-join Zoom calls and record meetings directly.' },
                { icon: '🤝', title: 'Google Meet', desc: 'Connect your Google Workspace for seamless transcription.' },
                { icon: '📅', title: 'Google Calendar', desc: 'Sync upcoming meetings and auto-create meeting records.' },
                { icon: '💼', title: 'Salesforce / HubSpot', desc: 'Sync action items and meeting summaries to your CRM.' },
                { icon: '📋', title: 'Notion', desc: 'Export meeting notes directly to your Notion workspace.' },
              ].map((item) => (
                <ComingSoonCard key={item.title} icon={item.icon} title={item.title} description={item.desc} />
              ))}
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Security</h2>
            <ComingSoonCard
              icon="🔐"
              title="SSO / SAML"
              description="Single sign-on with your company's identity provider (Okta, Azure AD, Google Workspace)."
            />
          </section>
        </div>
      </div>
    </>
  );
}
