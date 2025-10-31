import { useEffect, useState } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';

interface Thread { id: string; title: string; last: string; unread?: boolean }

export default function CustomerMessages() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);

  useEffect(() => {
    const mock: Thread[] = [
      { id: 't1', title: 'Support - Order C-10019', last: 'We will get back soon', unread: true },
      { id: 't2', title: 'Vendor A', last: 'Thanks for purchasing!' },
      { id: 't3', title: 'Support - Delivery', last: 'Package is on the way' },
    ];
    setThreads(mock);
    setActive(mock[0]);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <CustomerSidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <CustomerTopbar />
        </div>

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">Messages</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden md:col-span-1">
              <div className="p-3 border-b text-sm text-gray-600">Conversations</div>
              <div className="divide-y">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(t)}
                    className={`w-full text-left p-3 hover:bg-gray-50 ${active?.id === t.id ? 'bg-gray-50' : ''}`}
                  >
                    <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                      {t.title}
                      {t.unread && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#4B341C] text-white">New</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{t.last}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 md:col-span-2 h-[480px] flex flex-col">
              <div className="p-3 border-b text-sm font-medium text-gray-700">{active?.title || 'No conversation selected'}</div>
              <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                <div className="text-xs text-gray-500 text-center">Today</div>
                <div className="flex gap-2">
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-800">Hello, I have a question about my order.</div>
                </div>
                <div className="flex gap-2 justify-end">
                  <div className="px-3 py-2 bg-[#4B341C] text-white rounded-md text-sm">Sure, how can we help?</div>
                </div>
              </div>
              <div className="p-3 border-t flex items-center gap-2">
                <input className="flex-1 h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4B341C]" placeholder="Type a message" />
                <button className="h-10 px-4 rounded-md bg-[#4B341C] text-white">Send</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
