import { useEffect, useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../config/baseUrl';

import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import StatsCard from '../components/vendorDashboard/StatsCard';
import BarChart from '../components/vendorDashboard/BarChart';
import LineChart from '../components/vendorDashboard/LineChart';

// ---------------------- Interfaces ----------------------

interface VendorProduct {
    id: number;
}

interface VendorOrder {
    id: number;
}

interface DashboardStats {
    total_earnings: number;
    month_earnings: number;
    pending_payouts: number;

    productsChange?: string;
    totalOrders?: string;
    ordersChange?: string;
    avgRating?: string;
    ratingChange?: string;
}

// ---------------------- JWT Helper ----------------------

const getUserIdFromToken = (token: string): string | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));

        return payload.id || payload.userId || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

// ---------------------- Component ----------------------

export default function VendorDashboard() {
    const [stats, setStats] = useState<{ summary: DashboardStats } | null>(null);

    const [totalProducts, setTotalProducts] = useState<number | null>(null);
    const [totalOrders, setTotalOrders] = useState<number | null>(null);

    const [loading, setLoading] = useState(true);

    // ---------------------- Fetching Logic ----------------------

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setLoading(false);
            return;
        }

        const vendorId = getUserIdFromToken(token);
        if (!vendorId) {
            console.error("Vendor ID not found in token. Cannot fetch data.");
            setLoading(false);
            return;
        }

        const fetchEarningsSummary = async () => {
            try {
                const res = await axios.get(`${getBaseUrl()}/payouts/vendor/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard summary:", error);
            }
        };

        const fetchProductCount = async () => {
            try {
                const res = await axios.get<VendorProduct[]>(
                    `${getBaseUrl()}/products/vendor/${vendorId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setTotalProducts(res.data.length);
            } catch (error) {
                console.error("Failed to fetch product count:", error);
                setTotalProducts(0);
            }
        };

        const fetchOrderCount = async () => {
            try {
                const res = await axios.get<VendorOrder[]>(
                    `${getBaseUrl()}/orders/vendor/${vendorId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setTotalOrders(res.data.length);
            } catch (error) {
                console.error("Failed to fetch order count:", error);
                setTotalOrders(0);
            }
        };

        Promise.all([fetchEarningsSummary(), fetchProductCount(), fetchOrderCount()])
            .finally(() => setLoading(false));

    }, []);

    // ---------------------- UI Helpers ----------------------

    const formatCurrency = (value: number | null | undefined): string => {
        if (value === undefined || value === null) return 'N/A';
        return `RF ${value.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const cardValue = (
        value: number | null | undefined,
        isCurrency: boolean = true
    ): string => {
        if (loading) return "...";
        if (value === undefined || value === null) return "N/A";
        return isCurrency ? formatCurrency(value) : value.toLocaleString('en-US');
    };

    const productCountValue = loading
        ? "..."
        : totalProducts !== null
        ? totalProducts.toLocaleString('en-US')
        : "N/A";

    const orderCountValue = loading
        ? "..."
        : totalOrders !== null
        ? totalOrders.toLocaleString('en-US')
        : "N/A";

    const earningsChange = "";

    // ---------------------- UI ----------------------

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

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 mt-4">

                        <StatsCard
                            title="Total Earnings (All the time)"
                            value={cardValue(stats?.summary.total_earnings)}
                            icon="wallet"
                        />

                        <StatsCard
                            title="This Month's Earnings"
                            value={cardValue(stats?.summary.month_earnings)}
                            change={earningsChange}
                            icon="wallet"
                        />

                        <StatsCard
                            title="Total Products"
                            value={productCountValue}
                            change={earningsChange}
                            icon="product"
                        />

                        <StatsCard
                            title="Total Orders"
                            value={orderCountValue}
                            change={earningsChange}
                            icon="orders"
                        />

                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <BarChart />
                        <LineChart />
                    </div>

                </main>

            </div>

        </div>
    );
}
