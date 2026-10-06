"use client"
import React from "react"
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function AdminDashboard() {
  const kpis = [
    { title: "Total Revenue", value: "₹4,25,000", icon: DollarSign, trend: "+12.5%", isPositive: true },
    { title: "Active Orders", value: "84", icon: ShoppingBag, trend: "+4.2%", isPositive: true },
    { title: "Conversion Rate", value: "3.2%", icon: TrendingUp, trend: "-1.1%", isPositive: false },
  ]

  const recentOrders = [
    { id: "#ORD-001", customer: "Rahul Sharma", product: "Metro Aero Speed", date: "Oct 06, 2026", amount: "₹18,999", status: "Delivered" },
    { id: "#ORD-002", customer: "Priya Patel", product: "Eco-Charge X1", date: "Oct 05, 2026", amount: "₹32,999", status: "Processing" },
    { id: "#ORD-003", customer: "Amit Singh", product: "Junior Trailblazer", date: "Oct 05, 2026", amount: "₹5,200", status: "Shipped" },
    { id: "#ORD-004", customer: "Neha Gupta", product: "Metro Thunderbolt", date: "Oct 04, 2026", amount: "₹12,499", status: "Delivered" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin. Here is what is happening with your store today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">{kpi.value}</h3>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`flex items-center text-sm font-semibold ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                {kpi.isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {kpi.trend}
              </span>
              <span className="text-slate-400 text-sm ml-2">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
          <button className="text-indigo-500 font-medium hover:text-indigo-600 transition-colors text-sm">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{order.amount}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                        order.status === 'Processing' ? 'bg-amber-100 text-amber-700' : 
                        'bg-blue-100 text-blue-700'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
