import AdminLayout from '@/components/AdminLayout';
import { Eye } from 'lucide-react';

// Dummy data
const ORDERS = [
    { id: 'ord_123', customer: 'John Doe', date: '2023-10-15', total: 8999, status: 'Delivered', payment: 'Paid' },
    { id: 'ord_124', customer: 'Jane Smith', date: '2023-11-02', total: 12499, status: 'Processing', payment: 'Paid' },
    { id: 'ord_125', customer: 'Alice Johnson', date: '2023-11-05', total: 6999, status: 'Pending', payment: 'Pending' },
];

export default function AdminOrdersPage() {
    return (
        <AdminLayout title="Orders">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Order ID</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Customer</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Date</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Total</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm">Payment</th>
                            <th className="px-6 py-3 font-medium text-gray-500 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {ORDERS.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">#{order.id}</td>
                                <td className="px-6 py-4">{order.customer}</td>
                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                <td className="px-6 py-4">₹{order.total.toLocaleString('en-IN')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${order.payment === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.payment}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-black">
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
