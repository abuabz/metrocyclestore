"use client"
import React, { useState } from "react"
import { Trash2, Loader2, Phone, MapPin, Eye, Clock, CheckCircle2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"

export default function AdminRequests() {
  const queryClient = useQueryClient()
  
  // Modal states for viewing images
  const [viewImages, setViewImages] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts")
      const json = await res.json()
      if (!json.success) throw new Error("Failed to fetch")
      return json.data
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ M07_status: status })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
    }
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      deleteMutation.mutate(id)
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus })
  }

  const openImages = (images: string[]) => {
    setViewImages(images)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Service Requests</h1>
          <p className="text-slate-500 mt-1">Manage customer service and repair requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Req ID & Date</th>
                <th className="px-6 py-4 font-medium">Customer Details</th>
                <th className="px-6 py-4 font-medium">Attachments</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No service requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req: any) => (
                  <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block mb-1">
                        {req.contactId}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{req.M07_name}</p>
                      <div className="text-xs text-slate-500 mt-1 flex flex-col gap-1">
                        <span className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {req.M07_phone_number}</span>
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {req.M07_place}, {req.M07_district} ({req.M07_pincode})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {req.M07_cycle_image?.length > 0 && (
                          <button onClick={() => openImages(req.M07_cycle_image)} className="text-xs font-bold px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 flex items-center">
                            <Eye className="w-3 h-3 mr-1" /> Cycle ({req.M07_cycle_image.length})
                          </button>
                        )}
                        {req.M07_warranty_card_photo?.length > 0 && (
                          <button onClick={() => openImages(req.M07_warranty_card_photo)} className="text-xs font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 flex items-center">
                            <Eye className="w-3 h-3 mr-1" /> Warranty ({req.M07_warranty_card_photo.length})
                          </button>
                        )}
                        {!req.M07_cycle_image?.length && !req.M07_warranty_card_photo?.length && (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={req.M07_status || "To do"} 
                        onChange={(e) => handleStatusChange(req._id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border outline-none ${
                          req.M07_status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          req.M07_status === "Doing" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="To do">To do</option>
                        <option value="Doing">Doing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(req._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Attached Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {viewImages.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200">
                  <img src={img} alt="Attachment" className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
