'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Meetings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="2.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 9H13M5 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 6H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 12L15.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 14L6 9L9 11L13 6L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    href: '/team',
    label: 'Team',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="13" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M1 15c0-2.761 2.686-5 6-5s6 2.239 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 10c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const BOTTOM_NAV = [
  {
    href: '/integrations',
    label: 'Integrations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M7 11L11 7M5 13l1.5-1.5M13 5l-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="4" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 14H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.757 3.757l1.06 1.06M13.182 13.182l1.061 1.06M3.757 14.243l1.06-1.06M13.182 4.818l1.061-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className={cx('sidebar', collapsed && 'collapsed')} aria-label="Main navigation">
      {/* Logo */}
      <Link href="/" className="sidebar-logo" tabIndex={0}>
        <div className="sidebar-logo-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8C2 4.686 4.686 2 8 2s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" fill="white" fillOpacity="0.3"/>
            <path d="M6 5.5L11 8L6 10.5V5.5Z" fill="white"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">Fireflies</span>
      </Link>

      {/* Collapse toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Main nav */}
      <nav className="sidebar-nav" role="navigation">
        <span className="sidebar-section-label">Workspace</span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cx('sidebar-nav-item', isActive(item.href) && 'active')}
            title={collapsed ? item.label : undefined}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}

        <div className="sidebar-divider" />

        <span className="sidebar-section-label">Platform</span>
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cx('sidebar-nav-item', isActive(item.href) && 'active')}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" role="button" tabIndex={0} aria-label="User profile">
          <div className="sidebar-avatar">AJ</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Alex Johnson</div>
            <div className="sidebar-user-email">alex@acme.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
