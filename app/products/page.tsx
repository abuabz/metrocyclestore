"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

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
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map()) // Map category ID to name
  const [categoryIdMap, setCategoryIdMap] = useState<Map<string, string>>(new Map()) // Map name to category ID
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true)
  const [productError, setProductError] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState<number>(0)

  // Ref to store the debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

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
        setCategoryError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Fetch products from API with debounced search
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)
      setProductError(null)
      try {
        const categoryID = searchParams.get("categoryID")
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-sku`
        const queryParams = new URLSearchParams()
        if (categoryID) {
          queryParams.append("categoryId", categoryID)
        }
        if (searchTerm) {
          queryParams.append("search", searchTerm)
        }
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`
        }
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data: ProductApiResponse = await response.json()
        if (data.success) {
          const mappedProducts: Product[] = data.data.products_skus.map((sku) => ({
            id: sku._id,
            name: sku.M06_product_sku_name,
            price: sku.M06_price,
            category: "", // Not provided by API, will use client-side filtering
            image: sku.M06_thumbnail_image,
            rating: 5, // Static as not provided by API
            reviews: 20, // Static as not provided by API
            originalPrice: sku.M06_MRP,
            description: sku.M06_description,
          }))
          setTotalProducts(data.data.pagination.totalItems)
          setFilteredProducts(mappedProducts)
        } else {
          throw new Error(data.msg || 'API returned unsuccessful response')
        }
      } catch (err) {
        setProductError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoadingProducts(false)
      }
    }

    // Debounce the API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      setLoadingProducts(true) // Show loader during debounce
    }
    debounceTimer.current = setTimeout(() => {
      fetchProducts()
    }, 2000)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchParams, searchTerm])

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

  // Handle intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  // Handle category click to update URL and set active category
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    if (category === "All") {
      // Remove categoryID from URL
      router.push("/products")
    } else {
      // Add categoryID to URL
      const categoryID = categoryIdMap.get(category)
      if (categoryID) {
        router.push(`/products?categoryID=${categoryID}`)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .categories-container {
          display: flex;
          overflow-x: auto;
          gap: 0.5rem;
          padding: 0.5rem 0;
        }
        .loader {
          transform: rotateZ(45deg);
          perspective: 1000px;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          color: #fff;
          margin: 0 auto;
        }
        .loader:before,
        .loader:after {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: inherit;
          height: inherit;
          border-radius: 50%;
          transform: rotateX(70deg);
          animation: 1s spin linear infinite;
        }
        .loader:after {
          color: #ebb613;
          transform: rotateY(70deg);
          animation-delay: .4s;
        }
        
        /* Products section loading container */
        .products-loading-container {
          // min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          // background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(3px);
          border-radius: 12px;
          margin: 2rem 0;
        }
        
        .dark .products-loading-container {
          background: rgba(0, 0, 0, 0.3);
        }
        
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotateZ(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotateZ(360deg);
          }
        }
        @keyframes rotateccw {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }
        @keyframes spin {
          0%,
          100% {
            box-shadow: .2em 0px 0 0px currentcolor;
          }
          12% {
            box-shadow: .2em .2em 0 0 currentcolor;
          }
          25% {
            box-shadow: 0 .2em 0 0px currentcolor;
          }
          37% {
            box-shadow: -.2em .2em 0 0 currentcolor;
          }
          50% {
            box-shadow: -.2em 0 0 0 currentcolor;
          }
          62% {
            box-shadow: -.2em -.2em 0 0 currentcolor;
          }
          75% {
            box-shadow: 0px -.2em 0 0 currentcolor;
          }
          87% {
            box-shadow: .2em -.2em 0 0 currentcolor;
          }
        }
      `}</style>
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <Image src="./assets/ourproducts.jpg" alt="Products Hero" fill className="object-cover " />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/70 to-[#000000c7]" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up mobile-text-2xl">
              Our Products
            </h1>
            <p className="text-base md:text-lg lg:text-xl animate-fade-in-up animation-delay-300 mobile-text-base">
              Discover our amazing collection of cycles, toys, and accessories
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700 w-full"
              />
            </div>
            <div className="w-full md:w-1/2">
              {loadingCategories ? (
                <div className="text-center py-4">
                  <span className="loader"></span>
                </div>
              ) : categoryError ? (
                <p className="text-red-500 text-center">{categoryError}</p>
              ) : (
                <div className="categories-container scrollbar-hide">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => handleCategoryClick(category)}
                      className={`rounded-full px-6 py-2 transition-all duration-300 mobile-text-sm whitespace-nowrap ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-yellow-500 to-white text-black shadow-lg transform scale-105"
                          : "border-yellow-200 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300"
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
      <section
        id="products-grid"
        data-animate
        className={`py-12 px-4 transition-all duration-1000 ${
          isVisible["products-grid"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Only show product count when not loading */}
          {!loadingProducts && (
            <div className="mb-6 text-center">
              {productError ? (
                <p className="text-red-500 mobile-text-sm">{productError}</p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400 mobile-text-sm">
                  Showing {filteredProducts.length} of {totalProducts} products
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              )}
            </div>
          )}

          {/* Loading state for products */}
          {loadingProducts ? (
            <div className="products-loading-container">
              <span className="loader"></span>
              {/* <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
                Loading products...
              </p> */}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card
                    className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 overflow-hidden cursor-pointer ${
                      isVisible["products-grid"]
                        ? `opacity-100 transform translate-y-0 transition-delay-[${index * 50}ms]`
                        : "opacity-0 transform translate-y-8"
                    }`}
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={400}
                          className="w-full h-64 object-fit group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-yellow-500 transition-colors duration-300 line-clamp-2 mobile-text-sm">
                          {product.name}
                        </h3>
                        <p className="line-clamp-2 overflow-hidden text-ellipsis">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-5">
                          <div className="flex gap-2 items-center">
                            <span className="text-lg flex items-center gap-3 md:text-lg font-bold text-yellow-500 mobile-text-lg">
                              ₹{product.price}
                            </span>
                            <span className="text-lg md:text-sm text-gray-500 dark:text-gray-400 line-through mobile-text-base">
                              ₹{product.originalPrice}
                            </span>
                          </div>
                          <Badge className="bg-red-500 text-white ml-2 text-center">Save ₹{product.originalPrice - product.price}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !loadingProducts && !productError && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2 mobile-text-lg">
                No products found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mobile-text-sm">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}