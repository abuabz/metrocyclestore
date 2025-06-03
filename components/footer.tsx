"use client"

import type React from "react"

import { useState } from "react"
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, Clock, Heart, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
]

const productCategories = [
  { name: "Cycles", href: "/products?category=cycles" },
  { name: "Toys", href: "/products?category=toys" },
  { name: "Accessories", href: "/products?category=accessories" },
  { name: "Safety Gear", href: "/products?category=safety" },
]

const services = [
  { name: "Repair Services", href: "/services#repair" },
  { name: "Customization", href: "/services#custom" },
  { name: "Delivery", href: "/services#delivery" },
  { name: "Warranty", href: "/services#warranty" },
]

export default function Footer() {
  const [email, setEmail] = useState("")

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 dark:from-gray-950 dark:via-purple-950 dark:to-pink-950 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-400 rounded-full animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-blue-400 rounded-full animate-bounce" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C&T</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Cycles & Toys</h3>
                  <p className="text-sm text-gray-300">Adventure Awaits</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed mobile-text-sm">
                Bringing joy and adventure to families through our carefully curated collection of premium cycles and
                educational toys since 2010.
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 rounded-full bg-white/10 hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 group-hover:animate-bounce" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 rounded-full bg-white/10 hover:bg-pink-600 hover:scale-110 transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 group-hover:animate-bounce" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-3 rounded-full bg-white/10 hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
                >
                  <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-purple-600 mobile-text-base">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-purple-600 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products & Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-purple-600 mobile-text-base">Categories</h4>
              <ul className="space-y-3">
                {productCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={category.href}
                      className="text-gray-300 hover:text-purple-600 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold text-purple-600 pt-4 mobile-text-base">Services</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-gray-300 hover:text-purple-600 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info & Newsletter */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-purple-600 mobile-text-base">Get In Touch</h4>

              {/* Contact Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm mobile-text-sm">123 Toy Street, Fun City, FC 12345</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm mobile-text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm mobile-text-sm">info@cyclesandtoys.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm mobile-text-sm">Mon-Sat: 9AM-7PM, Sun: 10AM-6PM</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h5 className="font-semibold text-pink-300 mobile-text-base">Newsletter</h5>
                <p className="text-gray-400 text-sm mobile-text-sm">Get updates on new products and special offers!</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg hover:scale-105 transition-all duration-300 mobile-text-sm"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours Banner */}
        <div className="bg-gradient-to-r from-purple-800 to-pink-800 dark:from-purple-900 dark:to-pink-900 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-purple-600 font-semibold mobile-text-sm">
              🎉 Special Weekend Hours: Saturday 9AM-8PM, Sunday 10AM-7PM
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-black/30 dark:bg-black/50 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm mobile-text-sm">
                <span>© 2024 Cycles & Toys. Made with</span>
                <Heart className="w-4 h-4 text-red-400 animate-pulse" />
                <span>for families everywhere.</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400 mobile-text-sm">
                <Link href="/privacy" className="hover:text-purple-600 transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-purple-600 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/returns" className="hover:text-purple-600 transition-colors duration-300">
                  Returns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-20 right-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  )
}
