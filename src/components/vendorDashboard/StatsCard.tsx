// src/components/vendor/StatsCard.tsx
import { Eye, DollarSign, ShoppingCart, Star, Wallet, Package } from 'lucide-react';

const icons = {
  views: Eye,
  sales: DollarSign,
  orders: ShoppingCart,
  rating: Star,
  wallet: Wallet,
  product: Package
};

interface Props {
  title: string;
  value: string | number;
  change?: string;
  icon: keyof typeof icons;
}

export default function StatsCard({ title, value, change, icon }: Props) {
  const Icon = icons[icon];
  const isPositive = change?.startsWith('+');
  const isRating = icon === 'rating';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className="w-5 h-5 text-[#4B341C]" />
      </div>

      <p className="text-2xl font-bold text-[#4B341C]">{value}</p>

      <p
        className={`text-sm mt-1 ${
          isRating
            ? 'text-gray-500'
            : isPositive
            ? 'text-green-600'
            : 'text-red-600'
        }`}
      >
        {change}
      </p>
    </div>
  );
}