import { Topbar } from '@/components/layout/Topbar';

function PlaceholderCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <h3 style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{desc}</p>
      <span className="badge badge-muted" style={{ marginTop: 10 }}>Coming Soon</span>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <Topbar title="Analytics" />
      <div className="page-container">
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 560 }}>
          Analytics and insights across all your meetings. Track speaking time, engagement, and trends.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          <PlaceholderCard title="Speaking Time by Participant" desc="See who's talking most in your meetings and balance participation." />
          <PlaceholderCard title="Meeting Frequency" desc="Track how often your team meets and identify meeting overload." />
          <PlaceholderCard title="Action Item Completion" desc="Monitor follow-through on tasks assigned in meetings." />
          <PlaceholderCard title="Topic Trends" desc="Discover recurring themes and topics across your meeting library." />
          <PlaceholderCard title="Meeting Duration Insights" desc="Analyze whether your meetings are running over schedule." />
          <PlaceholderCard title="Transcript Sentiment" desc="AI-powered sentiment analysis on meeting discussions." />
        </div>
      </div>
    </>
  );
}
