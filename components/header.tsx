"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ShoppingCart, Search, Phone, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { usePathname, useRouter } from "next/navigation"
import { useProductContext } from "@/context/product-context"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { getCartCount } = useCart()
  const { products } = useProductContext()
  const pathname = usePathname()
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setIsMenuOpen(false)
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const filteredSuggestions = searchQuery.trim()
    ? products.filter(product =>
      product.M01_name.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : []

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/assets/Logomain.png"
                alt="Logo"
                className={`w-40 h-40 transition-transform duration-300 ${isScrolled ? "transform scale-90" : "transform scale-100"}`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-all duration-300 hover:scale-105 relative group ${pathname === item.href ? "text-yellow-500" : isScrolled ? "text-gray-200 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400" : "text-white hover:text-yellow-300"}`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* <ThemeToggle /> */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="sm"
                className={`relative p-2 rounded-full hover:scale-110 transition-all duration-300 ${isScrolled
                  ? "text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  : "text-white hover:text-purple-300 hover:bg-white/10"
                  }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Button>
            </Link>
            <Link href="tel:+9187145 83859">
              <Button
                size="sm"
                className="hidden sm:flex bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-full ${isScrolled
                ? "text-gray-700 dark:text-gray-300 hover:text-purple-600"
                : "text-white hover:text-purple-300"
                }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-4">
            <div className="relative" ref={searchRef}>
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                onClick={() => handleSearch()}
              />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className="pl-10 w-full rounded-full border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800"
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery.trim() && filteredSuggestions.length > 0 && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2">
                  {filteredSuggestions.map((product) => (
                    <Link
                      key={product.M01_id}
                      href={`/products/${product.M01_id}`}
                      onClick={() => {
                        setShowSuggestions(false)
                        setSearchQuery("")
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 relative rounded overflow-hidden flex-shrink-0 mr-3">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.M01_image_url}`}
                          alt={product.M01_name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.M01_name}</p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={() => handleSearch()}
                    className="w-full text-center text-xs text-yellow-600 font-medium py-2 border-t border-gray-50 hover:bg-gray-50 mt-1"
                  >
                    View all results
                  </button>
                </div>
              )}
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 font-medium transition-all duration-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg ${pathname === item.href ? "text-yellow-500" : "text-gray-700 dark:text-gray-300"}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            {/* <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-3">
              <Phone className="w-4 h-4 mr-2" />
              Call Now: (555) 123-4567
            </Button> */}
          </div>
        </div>
      </div>
    </header>
  )
}