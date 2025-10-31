import { useEffect, useState } from 'react';
import CustomerSidebar from '../../components/customerDashboard/Sidebar';
import CustomerTopbar from '../../components/customerDashboard/Navbar';
import { useCart } from '../../contexts/CartContext';

interface WishItem { id: string; name: string; price: number; vendor?: string; img?: string }

export default function CustomerWishlist() {
  const [items, setItems] = useState<WishItem[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Mock wishlist - replace with API call
    setItems([
      { id: 'w1', name: 'Handmade Basket', price: 12000 },
      { id: 'w2', name: 'Artisanal Coffee', price: 9000 },
      { id: 'w3', name: 'Traditional Fabric', price: 25000 },
    ]);
  }, []);

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const moveToCart = (it: WishItem) => {
    addToCart({ id: it.id, name: it.name, price: it.price, vendor: it.vendor || '', img: it.img || '', quantity: 1 });
    remove(it.id);
  };

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
          <h1 className="text-2xl font-semibold text-[#5a4632] mb-4">My Wishlist</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col">
                <div className="aspect-video bg-gray-50 rounded-md mb-3" />
                <div className="font-medium text-gray-800">{it.name}</div>
                <div className="text-gray-700 mb-3">₦{it.price.toLocaleString()}</div>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => moveToCart(it)} className="flex-1 h-9 rounded-md bg-[#4B341C] text-white text-sm">Add to cart</button>
                  <button onClick={() => remove(it.id)} className="h-9 px-3 rounded-md border border-gray-300 text-sm">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="mt-8 text-center text-gray-500">Your wishlist is empty.</div>
          )}
        </main>
      </div>
    </div>
  );
}
