"use client"
import React from "react"
import { 
  Package, 
  ShoppingCart, 
  MessageSquare,
  Star,
  Loader2
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

export default function AdminDashboard() {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await fetch("/api/v1/customer/product-sku")
      const json = await res.json()
      return json.success ? json.data.products_skus : []
    }
  })

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await fetch("/api/v1/customer/product-category")
      const json = await res.json()
      return json.success ? json.data.productCategories : []
    }
  })

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts")
      const json = await res.json()
      return json.success ? json.data : []
    }
  })

  const { data: featured = [], isLoading: loadingFeatured } = useQuery({
    queryKey: ['admin-featured'],
    queryFn: async () => {
      const res = await fetch("/api/admin/featured")
      const json = await res.json()
      return json.success ? json.data : []
    }
  })

  const kpis = [
    { title: "Total Products", value: loadingProducts ? "..." : products.length, icon: Package, href: "/admin/products", color: "text-indigo-500", bg: "bg-indigo-50" },
    { title: "Categories", value: loadingCategories ? "..." : categories.length, icon: ShoppingCart, href: "/admin/categories", color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "Service Requests", value: loadingRequests ? "..." : requests.length, icon: MessageSquare, href: "/admin/requests", color: "text-amber-500", bg: "bg-amber-50" },
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
          <Link href={kpi.href} key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 block cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                <h3 className="text-4xl font-black text-slate-900 mt-2">{kpi.value}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-8 h-8" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-sm font-semibold text-slate-400 hover:text-slate-600">
              View details &rarr;
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
          </div>
          <Link href="/admin/featured" className="text-indigo-500 font-bold hover:text-indigo-600 transition-colors text-sm">Manage Featured</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Image</th>
                <th className="px-6 py-4 font-bold">Product Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingFeatured ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading featured products...
                  </td>
                </tr>
              ) : featured.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No featured products found. Add some from the Featured tab.
                  </td>
                </tr>
              ) : (
                featured.map((item: any, idx: number) => {
                  const product = item.M06_product_sku_id || {};
                  const category = product.M06_M05_product_id?.M05_M04_product_category?.M04_category_name || "Unknown";
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                          {product.M06_thumbnail_image ? (
                            <img src={product.M06_thumbnail_image} alt={product.M06_product_sku_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">No Img</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-extrabold text-slate-900">{product.M06_product_sku_name || "Unknown Product"}</p>
                        <p className="text-xs text-slate-500 mt-1">{product.M06_sku || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">{category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">
                          Featured
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
