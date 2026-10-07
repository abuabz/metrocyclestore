"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Bell, 
  Search,
  LogOut,
  Bike,
  Star,
  Wrench,
  MessageSquare
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Glassmorphism Aesthetic */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <Bike className="w-8 h-8 text-indigo-500 mr-3" />
          <span className="text-xl font-bold text-white tracking-wider">METRO<span className="text-indigo-500">ADMIN</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${pathname === "/admin" ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-800 hover:text-white"}`}>
            <LayoutDashboard className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/products" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith("/admin/products") ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-800 hover:text-white"}`}>
            <Package className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Products</span>
          </Link>
          <Link href="/admin/featured" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith("/admin/featured") ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-800 hover:text-white"}`}>
            <Star className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${!pathname.startsWith("/admin/featured") && "text-yellow-400"}`} />
            <span className="font-medium">Featured</span>
          </Link>
          <Link href="/admin/categories" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith("/admin/categories") ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-800 hover:text-white"}`}>
            <ShoppingCart className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Categories</span>
          </Link>
          <Link href="/admin/requests" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith("/admin/requests") ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-slate-800 hover:text-white"}`}>
            <MessageSquare className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Service Requests</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link href="#" className="flex items-center px-4 py-3 rounded-xl transition-all duration-300 hover:bg-slate-800 hover:text-white group">
            <Settings className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 group mt-2 text-left">
            <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
          <div className="relative w-96">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg cursor-pointer transform hover:scale-105 transition-all flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
