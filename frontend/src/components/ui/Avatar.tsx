'use client';
import { getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, color = '#6C47FF', size = 'md', className = '' }: AvatarProps) {
  return (
    <div
      className={`avatar avatar-${size} ${className}`}
      style={{ background: color }}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarStackProps {
  participants: { name: string; color: string }[];
  max?: number;
  size?: 'sm' | 'md';
}

export function AvatarStack({ participants, max = 4, size = 'sm' }: AvatarStackProps) {
  const visible = participants.slice(0, max);
  const overflow = participants.length - max;

  return (
    <div className="avatar-stack">
      {visible.map((p, i) => (
        <Avatar key={i} name={p.name} color={p.color} size={size} />
      ))}
      {overflow > 0 && (
        <div
          className={`avatar avatar-${size}`}
          style={{ background: '#6B7280' }}
          title={`+${overflow} more`}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
