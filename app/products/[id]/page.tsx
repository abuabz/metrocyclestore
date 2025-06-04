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

// Mock product data - in a real app, this would come from an API
const products = [
  {
    id: "1",
    name: "Mountain Explorer Bike",
    price: 299,
    originalPrice: 349,
    category: "Cycles",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 5,
    reviews: 24,
    badge: "Best Seller",
    description:
      "Experience the thrill of mountain biking with our premium Mountain Explorer Bike. Built for adventure and designed for durability, this bike features a lightweight aluminum frame, 21-speed gear system, and all-terrain tires that can handle any trail.",
    features: [
      "Lightweight aluminum frame",
      "21-speed Shimano gear system",
      "All-terrain tires with excellent grip",
      "Adjustable seat height",
      "Front suspension for smooth rides",
      "Dual disc brakes for safety",
    ],
    specifications: {
      "Frame Material": "Aluminum Alloy",
      "Wheel Size": "26 inches",
      "Gear System": "21-speed Shimano",
      Brakes: "Dual Disc Brakes",
      Weight: "15 kg",
      "Max Load": "120 kg",
    },
    inStock: true,
    stockCount: 15,
  },
  {
    id: "2",
    name: "Racing Car Toy Set",
    price: 49,
    originalPrice: 59,
    category: "Toys",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4,
    reviews: 18,
    badge: "New",
    description:
      "Rev up the fun with our exciting Racing Car Toy Set! This comprehensive set includes multiple racing cars, a race track, and accessories for hours of imaginative play.",
    features: [
      "6 different racing cars included",
      "Modular track system",
      "LED lights and sound effects",
      "Remote control functionality",
      "Educational STEM components",
      "Safe, non-toxic materials",
    ],
    specifications: {
      "Age Range": "3-12 years",
      Material: "ABS Plastic",
      Battery: "AA x 4 (included)",
      "Track Length": "2 meters",
      "Cars Included": "6 pieces",
      "Remote Range": "10 meters",
    },
    inStock: true,
    stockCount: 8,
  },
  // Add more products as needed...
]

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
  const [activeTab, setActiveTab] = useState("description")
  const [isVisible, setIsVisible] = useState({})

  const product = products.find((p) => p.id === productId)
  const isInCart = product ? items.some((item) => item.id === product.id) : false

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
              Product Not Found
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
                  {/* <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div> */}
                  {/* <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">({product.reviews} reviews)</span> */}
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
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg mobile-text-base">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 mobile-text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-gray-800 dark:text-gray-200 mobile-text-sm">{key}:</span>
                    <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2 mobile-text-2xl">
                    {product.rating}.0
                  </div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mobile-text-sm">Based on {product.reviews} reviews</p>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <Card key={review} className="border-0 bg-white dark:bg-gray-800 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 font-semibold">U{review}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-sm">
                                Customer {review}
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                              Great product! Excellent quality and fast delivery. Highly recommended for anyone looking
                              for {product.category.toLowerCase()}.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
