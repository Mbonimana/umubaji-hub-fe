import LineChart from '../../components/adminDashboard/LineChart';
import PieChart from '../../components/adminDashboard/PieChart';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart title="Platform Revenue & Orders" />
        <PieChart title="Sales by Category" />
      </div>
    </div>
  );
}
