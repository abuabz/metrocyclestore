"use client"

import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart, Search, Phone, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

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
  const { getCartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="./Logomain.png"
                alt="Logo"
                className={`w-40 h-40 transition-transform duration-300 ${isScrolled ? "transform scale-90" : "transform scale-100"
                  }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-all duration-300 hover:scale-105 relative group ${isScrolled
                    ? "text-gray-200 dark:text-gray-300 hover:text-yellow-300 dark:hover:text-yellow-400"
                    : "text-white hover:text-yellow-300"
                  }`}
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          {/* <div className="hidden lg:flex items-center space-x-4">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isScrolled ? "text-gray-400" : "text-white/60"
                  }`}
              />
              <Input
                placeholder="Search..."
                className={`pl-10 w-64 rounded-full border-0 ${isScrolled
                    ? "bg-gray-100 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700"
                    : "bg-white/20 placeholder-white/60 text-white focus:bg-white/30"
                  }`}
              />
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Wishlist */}
           

            {/* Cart */}
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
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              </Button>
            </Link>

            {/* Call Button */}
            <Button
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>

            {/* Mobile Menu Button */}
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
        className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10 w-full rounded-full border-gray-200 dark:border-gray-700 focus:border-purple-500 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-300 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Call Button */}
            <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-3">
              <Phone className="w-4 h-4 mr-2" />
              Call Now: (555) 123-4567
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
