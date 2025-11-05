export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-lg font-semibold text-gray-800">Settings</h2>
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Platform Name</label>
          <input className="w-full border rounded px-3 py-2 text-sm" placeholder="UbubajiHub" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Support Email</label>
          <input className="w-full border rounded px-3 py-2 text-sm" placeholder="support@ububaji.com" />
        </div>
        <button className="bg-[#4B341C] text-white px-4 py-2 rounded-lg text-sm">Save Changes</button>
      </div>
    </div>
  );
}
