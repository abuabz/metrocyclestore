"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ShoppingCart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

export default function LightHeader() {
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
        <header className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center">
            {/* Floating Glass Capsule */}
            <div
                className={`w-[95%] max-w-7xl rounded-full border border-white/40 shadow-xl backdrop-blur-xl transition-all duration-300 ${isScrolled
                    ? "bg-white/80 py-2"
                    : "bg-white/60 py-3"
                    }`}
            >
                <div className={`transition-all duration-300 ${isScrolled ? "px-4" : "px-6"} flex items-center justify-between`}>

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-3 group shrink-0">
                        <div className="relative">
                            <img
                                src="/LogomainFav.png"
                                alt="Logo"
                                className={`transition-all duration-300 object-contain ${isScrolled ? "h-8 w-auto" : "h-10 w-auto"}`}
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:scale-105 relative group ${pathname === item.href ? "text-yellow-600" : "text-gray-800 hover:text-yellow-600"
                                    }`}
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-yellow-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        {/* Search Icon (Desktop) */}
                        <div className="hidden md:flex items-center relative" ref={searchRef}>
                            <div className="flex items-center bg-white/50 rounded-full px-3 py-1.5 border border-white/30 focus-within:ring-2 ring-yellow-400/50 transition-all">
                                <Search className="w-4 h-4 text-gray-500 mr-2 cursor-pointer" onClick={() => handleSearch()} />
                                <input
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setShowSuggestions(true)
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none text-sm w-24 focus:w-40 transition-all placeholder:text-gray-400 text-gray-800"
                                />
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && searchQuery.trim() && filteredSuggestions.length > 0 && (
                                <div className="absolute top-12 right-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                    {filteredSuggestions.map((product) => (
                                        <Link
                                            key={product.M01_id}
                                            href={`/products/${product.M01_id}`}
                                            onClick={() => {
                                                setShowSuggestions(false)
                                                setSearchQuery("")
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

                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative h-10 w-10 rounded-full bg-white/50 hover:bg-yellow-100/50 text-gray-800 transition-all duration-300"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                                    {getCartCount()}
                                </span>
                            </Button>
                        </Link>

                        <Link href="tel:+918714583859" className="hidden sm:block">
                            <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-5 h-10 text-xs font-bold shadow-lg transition-transform hover:scale-105">
                                Call Now
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden h-10 w-10 p-0 rounded-full bg-white/50 hover:bg-yellow-100/50 text-gray-800"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay - Separate Floating Glass Box */}
            <div
                className={`lg:hidden w-[90%] max-w-sm mt-3 transition-all duration-500 ease-in-out origin-top ${isMenuOpen ? "opacity-100 translate-y-0 max-h-[500px]" : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
                    }`}
            >
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden p-4">
                    <div className="space-y-1">
                        <div className="relative mb-4">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                                onClick={() => handleSearch()}
                            />
                            <Input
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="pl-10 w-full rounded-2xl border-gray-200 bg-gray-50/50 text-gray-800 focus:ring-yellow-400"
                            />
                        </div>

                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 font-medium transition-all duration-300 rounded-xl ${pathname === item.href ? "bg-yellow-50 text-yellow-700" : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    {item.name}
                                    {pathname === item.href && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
                                </div>
                            </Link>
                        ))}

                        <Link href="tel:+918714583859" onClick={() => setIsMenuOpen(false)}>
                            <Button className="w-full mt-4 bg-black text-white rounded-xl py-6 font-bold">
                                Call Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header >
    )
}
