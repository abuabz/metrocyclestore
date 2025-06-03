"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

const categories = ["All", "Cycles", "Toys", "Accessories", "Safety Gear",]

const products = [
  {
    id: "1",
    name: "Mountain Explorer Bike",
    price: 299,
    category: "Cycles",
    image: "https://images-cdn.ubuy.co.in/653ebb40c556d711a206eaca-hyper-bicycle-men-s-29-explorer.jpg",
    rating: 5,
    reviews: 24,
  },
  {
    id: "2",
    name: "Racing Car Toy Set",
    price: 49,
    category: "Toys",
    image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/vehicle-pull-along/l/c/b/6-pcs-mini-car-racing-friction-toy-car-set-for-kids-boys-and-original-imagknhg86ny4xdy.jpeg?q=90&crop=false",
    rating: 4,
    reviews: 18,
  },
  {
    id: "3",
    name: "Kids Safety Helmet",
    price: 25,
    category: "Safety Gear",
    image: "https://duckduckbaby.in/cdn/shop/files/DDB14863_1.jpg?v=1732084849?height=300&width=300",
    rating: 5,
    reviews: 32,
  },
  {
    id: "4",
    name: "Educational Building Blocks",
    price: 35,
    category: "Toys",
    image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQqnFHTlVwMkxBzZ01EsoEZIycKVqpPjA9ueKerZ4gcITlJKgCZssB88QRAjIroA7cSw_FJaVXEF-942R6MMN7xolQX_ojmAc8bzpXLt6Im",
    rating: 4,
    reviews: 15,
  },
  {
    id: "5",
    name: "Electric Scooter",
    price: 199,
    category: "Cycles",
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 28,
  },
  {
    id: "6",
    name: "Puzzle Game Collection",
    price: 29,
    category: "Toys",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 12,
  },
  {
    id: "7",
    name: "BMX Stunt Bike",
    price: 249,
    category: "Cycles",
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 19,
  },
  {
    id: "8",
    name: "Bike Lock Set",
    price: 15,
    category: "Accessories",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 8,
  },
  {
    id: "9",
    name: "Remote Control Drone",
    price: 89,
    category: "Toys",
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 22,
  },
  {
    id: "10",
    name: "Knee & Elbow Pads",
    price: 18,
    category: "Safety Gear",
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 14,
  },
  {
    id: "11",
    name: "Kids Balance Bike",
    price: 79,
    category: "Cycles",
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 35,
  },
  {
    id: "12",
    name: "LEGO Architecture Set",
    price: 65,
    category: "Toys",
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 27,
  },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})

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

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [selectedCategory, searchTerm])

  // const getBadgeColor = (badge) => {
  //   switch (badge) {
  //     case "Best Seller":
  //       return "bg-green-500"
  //     case "New":
  //       return "bg-blue-500"
  //     case "Popular":
  //       return "bg-purple-500"
  //     case "Featured":
  //       return "bg-pink-500"
  //     case "Hot":
  //       return "bg-red-500"
  //     case "Premium":
  //       return "bg-yellow-500"
  //     default:
  //       return "bg-gray-500"
  //   }
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
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
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 mobile-text-sm ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                    : "border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
            </div>
          </div>

          {/* Category Tabs */}
          
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
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mobile-text-sm">
              Showing {filteredProducts.length} of {products.length} products
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

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
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* {product.badge && (
                        <Badge className={`absolute top-2 left-2 ${getBadgeColor(product.badge)} text-white border-0`}>
                          {product.badge}
                        </Badge>
                      )} */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 mobile-text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 mobile-text-sm">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl md:text-2xl font-bold text-purple-600 mobile-text-lg">
                           ₹{product.price}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
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
