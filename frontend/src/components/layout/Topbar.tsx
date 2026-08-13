'use client';
import { ReactNode } from 'react';

interface TopbarProps {
  title: string;
  actions?: ReactNode;
}

export function Topbar({ title, actions }: TopbarProps) {
  return (
    <header className="topbar" role="banner">
      <h1 className="topbar-title">{title}</h1>
      {actions && <div className="topbar-actions">{actions}</div>}
    </header>
  );
}
