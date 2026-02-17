"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, Star, ArrowRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/light-header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import ScrollReveal from "@/components/ui/scroll-reveal"

// Define interfaces for category API response
interface ProductCategory {
  _id: string
  M04_category_name: string
  M04_image: string | null
  M04_M04_parent_category_id: string | null
  M04_is_active: number
  M04_deleted_at: string | null
  createdAt: string
  updatedAt: string
}

interface CategoryApiResponse {
  success: boolean
  msg: string
  data: {
    productCategories: ProductCategory[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      limit: number
    }
  }
  statusCode: number
}

// Define interfaces for product SKU API response
interface ProductSku {
  _id: string
  M06_sku: string
  M06_product_sku_name: string
  M06_description: string
  M06_thumbnail_image: string
  M06_MRP: number
  M06_price: number
  M06_quantity: number
  M06_is_new: boolean
  M06_single_order_limit: number | null
  M06_is_active: number
  M06_deleted_at: string | null
  M06_is_out_of_stock: boolean
  M06_M05_product_id: string
  createdAt: string
  updatedAt: string
  Variations: any[]
}

interface ProductApiResponse {
  success: boolean
  msg: string
  data: {
    products_skus: ProductSku[]
    pagination: {
      page: number
      limit: number
      totalItems: number
      totalPages: number
    }
  }
  statusCode: number
}

// Define interface for products to render
interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  rating: number
  reviews: number
  originalPrice: number
  description: string
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map())
  const [categoryIdMap, setCategoryIdMap] = useState<Map<string, string>>(new Map())
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true)
  const [productError, setProductError] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const productsPerPage = 32

  // Ref to store the debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Sync currentPage and searchTerm with URL query parameter
  useEffect(() => {
    const pageParam = searchParams.get("page")
    const searchParam = searchParams.get("search")

    const pageNumber = pageParam ? parseInt(pageParam, 10) : 1
    if (!isNaN(pageNumber) && pageNumber !== currentPage) {
      setCurrentPage(pageNumber)
    }

    if (searchParam !== null && searchParam !== searchTerm) {
      setSearchTerm(searchParam)
    }
  }, [searchParams])

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-category?limit=30`)
        if (!response.ok) {
          throw new Error('Failed to fetch product categories')
        }
        const data: CategoryApiResponse = await response.json()
        if (data.success) {
          const childCategories = data.data.productCategories.filter(
            (category) => category.M04_M04_parent_category_id !== null
          )
          const map = new Map<string, string>()
          const idMap = new Map<string, string>()
          childCategories.forEach((category) => {
            map.set(category._id, category.M04_category_name)
            idMap.set(category.M04_category_name, category._id)
          })
          setCategoryMap(map)
          setCategoryIdMap(idMap)
          setCategories(["All", ...childCategories.map((cat) => cat.M04_category_name)])
        } else {
          throw new Error(data.msg || 'API returned unsuccessful response')
        }
      } catch (err) {
        setCategoryError(err instanceof Error ? err.message : 'An error occurred while fetching categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch products from API with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      setProductError(null)
      try {
        const categoryID = searchParams.get("categoryID")
        const search = searchParams.get("search")

        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-sku`
        const queryParams = new URLSearchParams()
        queryParams.append("page", currentPage.toString())
        queryParams.append("limit", productsPerPage.toString())
        if (categoryID) {
          queryParams.append("categoryId", categoryID)
        }
        if (search) {
          queryParams.append("search", search)
        }
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`
        }
        console.log('Fetching products with URL:', url)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`)
        }
        const data: ProductApiResponse = await response.json()

        if (data.success) {
          const mappedProducts: Product[] = data.data.products_skus.map((sku) => ({
            id: sku._id,
            name: sku.M06_product_sku_name || "Unnamed Product",
            price: sku.M06_price || 0,
            category: "",
            image: sku.M06_thumbnail_image || "/placeholder.svg",
            rating: 5,
            reviews: 20,
            originalPrice: sku.M06_MRP || sku.M06_price,
            description: sku.M06_description || "No description available",
          }))
          setTotalProducts(data.data.pagination.totalItems)
          setTotalPages(data.data.pagination.totalPages)
          setFilteredProducts(mappedProducts)
        } else {
          // Check if it's just no products found (which might return success: false or empty data)
          // But based on previous code, empty array is handled in success block.
          // If data.success is false, it might be an error or just no results.
          setFilteredProducts([])
          setTotalProducts(0)
          setTotalPages(0)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching products'
        setProductError(errorMessage)
        console.error('Product fetch error:', errorMessage)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [searchParams, currentPage])

  // Update URL when searchTerm changes (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchTerm !== currentSearch) {
        const newParams = new URLSearchParams(searchParams.toString())
        if (searchTerm) {
          newParams.set("search", searchTerm)
        } else {
          newParams.delete("search")
        }
        newParams.set("page", "1") // Reset to page 1 on search change
        router.push(`/products?${newParams.toString()}`)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, searchParams, router])

  // Set active category based on URL query parameter
  useEffect(() => {
    const categoryID = searchParams.get("categoryID")
    if (categoryID && categoryMap.has(categoryID)) {
      const categoryName = categoryMap.get(categoryID)!
      setSelectedCategory(categoryName)
    } else {
      setSelectedCategory("All")
    }
  }, [searchParams, categoryMap])

  // Handle category click to update URL and set active category
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    // Keep search term? Usually category selection acts as a filter on top or a reset.
    // Let's reset search when changing category to be clean, or keep it.
    // "search can all the things". Let's reset search to focus on category.
    // Actually, usually users want "Mountain Bikes" -> then search "Trek".
    // Or Search "Red" -> then click "Helmets".
    // Let's Keep existing search params if possible? 
    // The previous implementation cleared it. I will stick to clearing it for category switch unless user requested otherwise.
    // But I will fix Pagination to keep search.

    const queryParams = new URLSearchParams()
    if (category !== "All") {
      const categoryID = categoryIdMap.get(category)
      if (categoryID) {
        queryParams.append("categoryID", categoryID)
      }
    }
    // We clear search here to show all products in that category
    setSearchTerm("")
    router.push(`/products?${queryParams.toString()}`)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      const queryParams = new URLSearchParams(searchParams.toString())
      queryParams.set("page", page.toString())
      router.push(`/products?${queryParams.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-200">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .categories-container {
          display: flex;
          overflow-x: auto;
          gap: 0.75rem;
          padding: 0.5rem 0.25rem;
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid #000;
          border-bottom-color: #facc15;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal animation="fade-in-up">
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 mb-6 px-4 py-1 text-sm">
              Our Collection
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Explore Premium <span className="text-yellow-500">Toys & Cycles</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover joy in every ride and play. Curated for safety, fun, and adventure.
            </p>
          </ScrollReveal>
        </div>

        {/* Abstract shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
      </section>

      {/* Search and Filter */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center">

            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for toys, cycles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-full h-12 bg-slate-50 w-full transition-all"
              />
            </div>

            {/* Categories */}
            <div className="w-full md:w-2/3 overflow-hidden">
              {loadingCategories ? (
                <div className="h-12 w-full bg-slate-100 rounded-full animate-pulse" />
              ) : categoryError ? (
                <p className="text-red-500 text-sm">{categoryError}</p>
              ) : (
                <div className="categories-container scrollbar-hide">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`rounded-full px-6 h-10 text-sm font-medium transition-all duration-300 whitespace-nowrap shadow-sm ${selectedCategory === category
                        ? "bg-black text-white hover:bg-gray-800 hover:text-white transform scale-105"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-200"
                        }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto">
          {/* Product count */}
          {!loadingProducts && (
            <div className="mb-8 flex justify-between items-end border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                </h2>
                {searchTerm && <p className="text-sm text-gray-500 mt-1">Found results for "{searchTerm}"</p>}
              </div>
              <p className="text-sm font-medium text-gray-500">
                <span className="text-black font-bold">{filteredProducts.length}</span> results
              </p>
            </div>
          )}

          {/* Loading state for products */}
          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="loader mb-4"></span>
              <p className="text-gray-500 animate-pulse">Loading products...</p>
            </div>
          ) : productError ? (
            <div className="text-center py-20">
              <p className="text-red-500 bg-red-50 px-6 py-4 rounded-xl inline-block">{productError}</p>
            </div>
          ) : (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                  {filteredProducts.map((product, index) => (
                    <ScrollReveal key={product.id} animation="fade-in-up" delay={index * 50} className="h-full" enableReAnimate={false}>
                      <Link href={`/products/${product.id}`} className="block h-full">
                        <Card className="border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full overflow-hidden bg-white group rounded-3xl">
                          <div className="relative h-40 md:h-64 bg-gray-50 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                            />
                            {product.originalPrice > product.price && (
                              <Badge className="absolute top-3 left-3 bg-red-500 text-white rounded-md px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                                Sale
                              </Badge>
                            )}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 hover:bg-yellow-400 hover:text-black transition-colors shadow-md">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <CardContent className="p-3 md:p-5">
                            <div className="flex justify-between items-start mb-1 md:mb-2">
                              <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-600 transition-colors w-full pr-1 md:pr-2" title={product.name}>
                                {product.name}
                              </h3>
                              <div className="flex items-center gap-0.5 text-yellow-400 text-[10px] md:text-xs font-bold shrink-0 mt-0.5 md:mt-1">
                                <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> 4.5
                              </div>
                            </div>

                            <p className="hidden md:block text-gray-500 text-xs mb-4 line-clamp-2 h-10 leading-relaxed">
                              {product.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-2 md:pt-3">
                              <div className="flex flex-col">
                                {product.originalPrice > product.price && (
                                  <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                )}
                                <span className="text-sm md:text-lg font-extrabold text-gray-900">₹{product.price}</span>
                              </div>
                              <Button size="sm" className="bg-black text-white hover:bg-yellow-500 hover:text-black rounded-lg px-2 md:px-4 h-7 md:h-9 text-[10px] md:text-xs font-bold transition-all shadow-lg shadow-gray-200">
                                Buy Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl">
                  <div className="text-gray-300 mb-6">
                    <Search className="w-20 h-20 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any products matching your criteria. Try selecting a different category or clearing your search.
                  </p>
                  <Button
                    onClick={() => { setSelectedCategory("All"); setSearchTerm(""); }}
                    className="mt-6 bg-yellow-400 text-black hover:bg-yellow-500 rounded-full px-8 py-2 font-bold"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-full border-gray-200 text-gray-900 font-bold hover:bg-black hover:text-white hover:border-black disabled:opacity-50 transition-all duration-300"
                  >
                    Previous
                  </Button>

                  {/* Simple pagination logic for display */}
                  <div className="px-4 font-bold text-gray-900">
                    Page {currentPage} of {totalPages}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-full bg-black text-white font-bold hover:bg-yellow-500 hover:text-black border-black hover:border-yellow-500 disabled:opacity-50 transition-all duration-300"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}