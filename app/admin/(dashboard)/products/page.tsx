"use client"
import React, { useEffect, useState, useRef } from "react"
import { Plus, Edit, Trash2, Search, Loader2, X, Upload } from "lucide-react"

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Toast state
  const [toast, setToast] = useState<{msg: string, type: 'error' | 'success'} | null>(null)

  const showToast = (msg: string, type: 'error' | 'success' = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  // Form states
  const [formData, setFormData] = useState({
    product_name: "",
    category_id: "",
    sku: "",
    description: "",
    gallery: [] as string[],
    specs: [] as {key: string, value: string}[],
    features: [] as string[],
    mrp: "",
    price: "",
    quantity: ""
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/v1/customer/product-sku")
      const json = await res.json()
      if (json.success) {
        setProducts(json.data.products_skus || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/v1/customer/product-category")
      const json = await res.json()
      if (json.success) {
        setCategories(json.data.productCategories || [])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const uploadData = new FormData()
      uploadData.append("file", file)

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        })
        const data = await res.json()
        if (data.success) {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }))
          showToast("Image uploaded successfully!", "success")
        } else {
          showToast(data.message, "error")
        }
      } catch (err) {
        showToast("Failed to upload image", "error")
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
  }

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specs: [...prev.specs, { key: "", value: "" }]
    }))
  }

  const removeSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }))
  }

  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    setFormData(prev => {
      const newSpecs = [...prev.specs]
      newSpecs[index][field] = val
      return { ...prev, specs: newSpecs }
    })
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const updateFeature = (index: number, val: string) => {
    setFormData(prev => {
      const newFeatures = [...prev.features]
      newFeatures[index] = val
      return { ...prev, features: newFeatures }
    })
  }

  const openAddModal = () => {
    setEditingId(null)
    setFormData({
      product_name: "", category_id: "", sku: "", description: "",
      gallery: [], specs: [], features: [], mrp: "", price: "", quantity: ""
    })
    setIsModalOpen(true)
  }

  const openEditModal = async (prod: any) => {
    setEditingId(prod._id)
    
    // Fetch full product details including gallery and specs
    try {
      const res = await fetch(`/api/v1/customer/product-sku/${prod._id}`)
      const json = await res.json()
      if (json.success) {
        const fullProd = json.data
        setFormData({
          product_name: fullProd.M06_product_sku_name || "",
          category_id: fullProd.M06_M05_product_id || prod.M06_M05_product_id?.M05_M04_product_category || "",
          sku: fullProd.M06_sku || "",
          description: fullProd.M06_description || "",
          gallery: fullProd.Images ? fullProd.Images.map((img: any) => img.M07_image_path) : [],
          specs: fullProd.M06_specs || [],
          features: fullProd.M06_features || [],
          mrp: fullProd.M06_MRP || "",
          price: fullProd.M06_price || "",
          quantity: fullProd.M06_quantity || ""
        })
      }
    } catch (e) {
      console.error(e)
    }

    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.product_name.trim() || !formData.category_id || !formData.price || !formData.sku) {
      return showToast("Please fill all required fields (Name, Category, SKU, Price)", "error")
    }
    setIsSaving(true)

    try {
      const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products"
      const method = editingId ? "PUT" : "POST"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      const data = await res.json()
      if (data.success) {
        setIsModalOpen(false)
        showToast(editingId ? "Product updated successfully!" : "Product created successfully!", "success")
        fetchProducts()
      } else {
        showToast(data.message, "error")
      }
    } catch (err) {
      showToast("Failed to save product", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        showToast("Product deleted successfully!", "success")
        fetchProducts()
      } else {
        showToast(data.message, "error")
      }
    } catch (err) {
      showToast("Failed to delete product", "error")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Products</h1>
          <p className="text-slate-500 mt-1">Manage your store products and inventory.</p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-500/30 transition-all">
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">SKU / Name</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                        {prod.M06_thumbnail_image ? (
                          <img src={prod.M06_thumbnail_image} alt={prod.M06_product_sku_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-slate-400">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{prod.M06_product_sku_name}</p>
                      <p className="text-xs text-slate-500">{prod.M06_sku}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{prod.M06_price}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prod.M06_quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {prod.M06_quantity > 0 ? `${prod.M06_quantity} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(prod)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(prod._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Full-screen Modal for Products */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 bg-white rounded-full p-1 border border-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8">
              
              {/* Image Upload Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Product Images</h3>
                    <p className="text-sm text-slate-500">The first image will be used as the cover thumbnail.</p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                </div>
                
                <div className="flex gap-4 overflow-x-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[160px] items-center">
                  {formData.gallery.length === 0 ? (
                    <div className="w-full text-center py-8 text-slate-400 text-sm font-medium">
                      No images uploaded yet.
                    </div>
                  ) : (
                    formData.gallery.map((img, index) => (
                      <div 
                        key={img} 
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", index.toString());
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const draggedIdx = parseInt(e.dataTransfer.getData("text/plain"));
                          if (draggedIdx === index) return;
                          
                          setFormData(prev => {
                            const newGallery = [...prev.gallery];
                            const [draggedItem] = newGallery.splice(draggedIdx, 1);
                            newGallery.splice(index, 0, draggedItem);
                            return { ...prev, gallery: newGallery };
                          });
                        }}
                        className="relative w-32 h-32 shrink-0 rounded-2xl border-2 border-slate-200 overflow-hidden group cursor-grab active:cursor-grabbing hover:border-indigo-400 transition-colors"
                      >
                        <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover pointer-events-none" />
                        {index === 0 && (
                          <div className="absolute top-0 left-0 w-full bg-indigo-500 text-white text-[10px] font-bold text-center py-1">COVER</div>
                        )}
                        <button 
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-6 h-6 text-white hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Form Grid */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Product Name *</label>
                    <input
                      type="text"
                      value={formData.product_name}
                      onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                      placeholder="e.g. Metro Thunderbolt"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    >
                      <option value="">Select a Category</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.M04_category_name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">SKU Code *</label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({...formData, sku: e.target.value})}
                      placeholder="e.g. SKU-1234"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="e.g. 15000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">MRP Price (₹)</label>
                    <input
                      type="number"
                      value={formData.mrp}
                      onChange={(e) => setFormData({...formData, mrp: e.target.value})}
                      placeholder="e.g. 18000"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  placeholder="Short description of the cycle..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 resize-none"
                ></textarea>
              </div>

              {/* Specifications Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Specifications</h3>
                    <p className="text-sm text-slate-500">Add technical details (e.g. Frame Material: Aluminum).</p>
                  </div>
                  <button 
                    onClick={addSpec}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Spec
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.specs.length === 0 ? (
                    <div className="w-full text-center py-6 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-sm font-medium">
                      No specifications added.
                    </div>
                  ) : (
                    formData.specs.map((spec, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={spec.key}
                          onChange={(e) => updateSpec(index, "key", e.target.value)}
                          placeholder="Key (e.g. Gears)"
                          className="w-1/3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => updateSpec(index, "value", e.target.value)}
                          placeholder="Value (e.g. 21 Speed)"
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
                        />
                        <button 
                          onClick={() => removeSpec(index)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Features Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Features</h3>
                    <p className="text-sm text-slate-500">Add highlight features (e.g. Dual Disc Brakes).</p>
                  </div>
                  <button 
                    onClick={addFeature}
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </button>
                </div>
                
                <div className="space-y-2">
                  {formData.features.length === 0 ? (
                    <div className="w-full text-center py-6 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-sm font-medium">
                      No features added.
                    </div>
                  ) : (
                    formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Feature (e.g. Dual Disc Brakes)"
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 text-sm"
                        />
                        <button 
                          onClick={() => removeFeature(index)}
                          className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 flex items-center transition-colors disabled:opacity-70"
              >
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-8 fade-in duration-300 z-[60] ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="font-semibold">{toast.msg}</div>
          <button onClick={() => setToast(null)} className="opacity-80 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
