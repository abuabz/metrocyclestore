"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Star, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"

// Define interface for API response
interface ProductImage {
  _id: string
  M07_image_path: string
  M07_M06_product_sku_id: string
  M07_order: number
  M07_is_active: number
}

interface ProductSpec {
  key: string
  value: string
}

interface ProductApiResponse {
  success: boolean
  msg: string
  data: {
    _id: string
    M06_sku: string
    M06_product_sku_name: string
    M06_description: string
    M06_features: string[]
    M06_specs: ProductSpec[]
    M06_thumbnail_image: string
    M06_MRP: number
    M06_price: number
    M06_quantity: number
    M06_is_new: boolean
    M06_single_order_limit: number | null
    M06_is_active: number
    M06_is_out_of_stock: boolean
    M06_M05_product_id: string
    Images: ProductImage[]
    Variations: any[]
  }
  statusCode: number
}

// Define interface for product to render
interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  category: string
  images: string[]
  rating: number
  reviews: number
  badge: string
  description: string
  features: string[]
  specifications: { [key: string]: string }
  inStock: boolean
  stockCount: number
}

// Keep related products array as per request
const relatedProducts = [
  {
    id: "3",
    name: "Kids Safety Helmet",
    price: 25,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
  },
  {
    id: "4",
    name: "Educational Building Blocks",
    price: 35,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
  },
  {
    id: "5",
    name: "Electric Scooter",
    price: 199,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const { addToCart, removeFromCart, items } = useCart()
  const { showToast } = useToast()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("features")
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({ "product-tabs": true }) // Set default to true for tabs
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-sku/${productId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const data: ProductApiResponse = await response.json()
        if (data.success) {
          const apiProduct = data.data
          const mappedProduct: Product = {
            id: apiProduct._id,
            name: apiProduct.M06_product_sku_name,
            price: apiProduct.M06_price,
            originalPrice: apiProduct.M06_MRP,
            category: "Cycles", // Not provided by API; set statically for now
            images: apiProduct.Images.map((img) => img.M07_image_path),
            rating: 5, // Static as not provided by API
            reviews: 24, // Static as not provided by API
            badge: apiProduct.M06_is_new ? "New" : "Best Seller", // Use M06_is_new for badge
            description: apiProduct.M06_description,
            features: apiProduct.M06_features,
            specifications: apiProduct.M06_specs.reduce((acc: { [key: string]: string }, spec: ProductSpec) => {
              acc[spec.key] = spec.value
              return acc
            }, {}),
            inStock: !apiProduct.M06_is_out_of_stock,
            stockCount: apiProduct.M06_quantity,
          }
          setProduct(mappedProduct)
        } else {
          throw new Error(data.msg || 'API returned unsuccessful response')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
              Loading...
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
              {error || "Product Not Found"}
            </h1>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-yellow-500 to-white text-black">Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const isInCart = items.some((item) => item.id === product.id)

  const handleCartAction = () => {
    if (isInCart) {
      removeFromCart(product.id)
      showToast(`${product.name} removed from cart!`, "info")
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
      })
      showToast(`${product.name} added to cart!`, "success")
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-green-500"
      case "New":
        return "bg-blue-500"
      case "Popular":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600 dark:text-gray-400 mobile-text-sm">
            <Link href="/" className="hover:text-yellow-500 dark:hover:text-yellow-500">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-yellow-500 dark:hover:text-yellow-500">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-yellow-600 dark:text-yellow-500">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-96 object-cover"
                />
                {product.badge && (
                  <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white border-0`}>
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-yellow-500 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 mobile-text-xl">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge
                    variant="outline"
                    className="text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl md:text-3xl font-bold text-yellow-500 mobile-text-xl">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400 line-through mobile-text-base">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500 text-white">Save ₹{product.originalPrice - product.price}</Badge>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium mobile-text-sm">
                      In Stock
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 dark:text-red-400 font-medium mobile-text-sm">Out of Stock</span>
                  </>
                )}
              </div>

              <p className="pe-5 text-gray-200">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vitae, expedita dolore eius temporibus asperiores officiis aspernatur placeat hic omnis vero. Possimus deserunt sed dolorum ipsum quasi natus deleniti, ratione beatae?</p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700 dark:text-gray-300 mobile-text-sm">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleCartAction}
                  disabled={!product.inStock}
                  size="lg"
                  className={`w-full py-4 text-base md:text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 mobile-text-base ${
                    isInCart
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {isInCart ? `Remove from Cart` : `Add to Cart - ₹${(product.price * quantity).toFixed(2)}`}
                </Button>

                <div className="grid grid-cols-3 gap-2 text-sm mobile-text-sm">
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Truck className="w-4 h-4" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                    <RotateCcw className="w-4 h-4" />
                    <span>30 Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section
        id="product-tabs"
        data-animate
        className={`py-12 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["product-tabs"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-8">
            {["features", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium capitalize transition-all duration-300 mobile-text-sm ${
                  activeTab === tab
                    ? "text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 mobile-text-sm">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No features available.</p>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium text-gray-800 dark:text-gray-200 mobile-text-sm">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {/* <section
        id="related-products"
        data-animate
        className={`py-12 px-4 transition-all duration-1000 ${
          isVisible["related-products"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-xl">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={300}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 mobile-text-sm">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < relatedProduct.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg md:text-xl font-bold text-purple-600 mobile-text-base">
                        ${relatedProduct.price}
                      </span>
                      <Link href={`/products/${relatedProduct.id}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full mobile-text-sm"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  )
}