import type { ReactNode } from 'react';

export type StatItem = {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
  highlight?: 'default' | 'muted' | 'success';
};

export default function StatsCards({ items }: { items: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-10">
      {items.map((k) => (
        <div key={k.title} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-primary">
            {k.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">{k.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold text-primary">{k.value}</p>
              {k.change && (
                <span className={`text-xs ${k.highlight === 'muted' ? 'text-gray-500' : 'text-green-600'}`}>{k.change}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
