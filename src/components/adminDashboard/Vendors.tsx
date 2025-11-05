export type VendorApproval = {
  id: string;
  name: string;
  email: string;
  meta?: string;
};

export default function Vendors({
  items = [
    { id: '1', name: 'Urban Woodworks', email: 'contact@urbanwood.com', meta: 'Lagos • Oct 15, 2025' },
    { id: '2', name: 'Artisan Furniture Studio', email: 'info@artisanfurniture.com', meta: 'Abuja • Oct 16, 2025' },
    { id: '3', name: 'Custom Crafts Pro', email: 'hello@customcrafts.com', meta: 'Port Harcourt • Oct 17, 2025' },
  ],
  onApprove,
  onReject,
  title = 'Pending Vendor Approvals',
}: {
  items?: VendorApproval[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  title?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-700">{title}</p>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800">{a.name}</p>
              <p className="text-xs text-gray-500">{a.email}</p>
              {a.meta && <p className="text-xs text-gray-400">{a.meta}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onApprove?.(a.id)} className="w-8 h-8 rounded-md bg-green-500 text-white text-sm">✓</button>
              <button onClick={() => onReject?.(a.id)} className="w-8 h-8 rounded-md bg-red-500 text-white text-sm">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
