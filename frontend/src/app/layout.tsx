import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'Fireflies — Meeting Intelligence',
  description: 'AI-powered meeting notes and transcription platform. Browse meetings, view interactive transcripts, and access AI-generated summaries.',
  keywords: 'meeting notes, transcription, AI summary, action items, meeting intelligence',
  openGraph: {
    title: 'Fireflies — Meeting Intelligence',
    description: 'AI-powered meeting notes and transcription platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <div className="app-shell">
            <Sidebar />
            <main className="app-content" id="main-content">
              {children}
            </main>
          </div>
          <ToastContainer />
        </ToastProvider>
      </body>
    </html>
  );
}
