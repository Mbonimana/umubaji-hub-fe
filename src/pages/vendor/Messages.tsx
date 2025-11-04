import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import { getBaseUrl } from '../../config/baseUrl';

interface IMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function Messages() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<IMessage | null>(null);
  const [reply, setReply] = useState('');
  const baseURL = useMemo(() => getBaseUrl(), []);

  const [vendorId, setVendorId] = useState<number | undefined>(() => {
    const qs = new URLSearchParams(window.location.search).get('vendorId');
    const stored = localStorage.getItem('vendorId') || sessionStorage.getItem('vendorId');
    const v = qs ?? stored ?? '';
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  });
 

  useEffect(() => {
    // If vendorId is present in query string, persist it for subsequent visits
    const qs = new URLSearchParams(window.location.search).get('vendorId');
    if (qs && !localStorage.getItem('vendorId')) {
      const n = Number(qs);
      if (Number.isFinite(n) && n > 0) {
        localStorage.setItem('vendorId', String(n));
        setVendorId(n);
      }
    }

    if (!vendorId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get<IMessage[]>(`${baseURL}/messages/vendor/${vendorId}`)
      .then((r) => setMessages(r.data))
      .catch((e) => setError(e?.response?.data?.message || 'Failed to load messages'))
      .finally(() => setLoading(false));
  }, [baseURL, vendorId]);

  const sendReply = async () => {
    if (!selected || !vendorId || !reply.trim()) return;
    try {
      await axios.post(`${baseURL}/messages`, {
        sender_id: vendorId,
        receiver_id: selected.sender_id,
        content: reply.trim(),
      });
      setReply('');
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Messages</h1>

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : !vendorId ? (
            <div className="text-gray-500 text-sm">No vendor context.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-[#f9fafb] text-gray-600">
                      <tr>
                        <th className="px-4 py-3">From</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Message</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((m, idx) => (
                        <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                          <td className="px-4 py-3 text-gray-800">{m.firstname} {m.lastname}</td>
                          <td className="px-4 py-3 text-gray-600">{m.email}</td>
                          <td className="px-4 py-3 text-gray-800 truncate max-w-[240px]" title={m.content}>{m.content}</td>
                          <td className="px-4 py-3 text-gray-600">{new Date(m.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100" onClick={() => setSelected(m)}>
                              Reply
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow border border-gray-100 p-4">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Reply</h2>
                {selected ? (
                  <>
                    <div className="text-sm text-gray-600 mb-2">To: {selected.firstname} {selected.lastname} ({selected.email})</div>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Type your reply..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4B341C]"
                    />
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={sendReply}
                        className="px-4 py-2 rounded-md bg-[#4B341C] text-white hover:opacity-90"
                        disabled={!reply.trim()}
                      >
                        Send
                      </button>
                      <button
                        onClick={() => { setSelected(null); setReply(''); }}
                        className="px-4 py-2 rounded-md border border-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">Select a message to reply.</div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
