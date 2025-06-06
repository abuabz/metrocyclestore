"use client";

import type React from "react";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const productCategories = [
  { name: "Cycles", href: "/products?category=cycles" },
  { name: "Toys", href: "/products?category=toys" },
  { name: "Accessories", href: "/products?category=accessories" },
  { name: "Safety Gear", href: "/products?category=safety" },
];

const services = [
  { name: "Repair Services", href: "/services#repair" },
  { name: "Customization", href: "/services#custom" },
  { name: "Delivery", href: "/services#delivery" },
  { name: "Warranty", href: "/services#warranty" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This is a basic example. In production, you should use a proper backend service
      await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          to: "info@cyclesandtoys.com",
        }),
      });
      console.log("Newsletter subscription:", email);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 dark:from-yellow-600  dark:to-black text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full animate-bounce" />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-red-400 rounded-full animate-pulse" />
        <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-blue-400 rounded-full animate-bounce" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img
                  src="./Logomain.png"
                  alt="Logo"
                  className="w-60 h-60 transition-transform duration-300"
                />
              </div>
              <p className="text-gray-200 leading-relaxed mobile-text-sm">
                Bringing joy and adventure to families through our carefully
                curated collection of premium cycles and educational toys since
                2010.
              </p>

              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/share/1BSkQxcTpm/?mibextid=wwXIfr">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 rounded-full bg-white/10 hover:bg-blue-600 hover:scale-110 transition-all duration-300 group"
                  >
                    <Facebook className="w-5 h-5 group-hover:animate-bounce" />
                  </Button>
                </Link>
                <Link href="https://www.instagram.com/metro.toys_?igsh=MWh2a2kwc2hxa240MA%3D%3D&utm_source=qr">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 rounded-full bg-white/10 hover:bg-pink-600 hover:scale-110 transition-all duration-300 group"
                  >
                    <Instagram className="w-5 h-5 group-hover:animate-bounce" />
                  </Button>
                </Link>
                <Link href="https://wa.me/+9187145 83859">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-3 rounded-full bg-white/10 hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-brand-whatsapp group-hover:animate-bounce"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                      <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-yellow-400 mobile-text-base">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-200 hover:text-yellow-500 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-yellow-400 mobile-text-base">
                Categories
              </h4>
              <ul className="space-y-3">
                {productCategories.map((category) => (
                  <li key={category.name}>
                    <Link
                      href={category.href}
                      className="text-gray-200 hover:text-yellow-500 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold text-yellow-400 pt-4 mobile-text-base">
                Services
              </h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.name}>
                    <Link
                      href={service.href}
                      className="text-gray-200 hover:text-yellow-500 transition-colors duration-300 hover:translate-x-1 transform inline-block mobile-text-sm"
                    >
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-orange-300 mobile-text-base">
                Get In Touch
              </h4>

              <div className="space-y-4">
                <Link href="https://maps.app.goo.gl/rmXMcXU5K8omi7BG9" className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm mobile-text-sm">
                    Airport Road Padikkal, Chelari, Malappuram. Kerala
                  </span>
                </Link>
                <Link href="tel:+9187145 83859" className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm mobile-text-sm">
                    +91 87145 83859
                  </span>
                </Link>
                <Link href="mailto:info@cyclesandtoys.com" className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm mobile-text-sm">
                    info@cyclesandtoys.com
                  </span>
                </Link>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm mobile-text-sm">
                    Mon-Sat: 9AM-8PM, Sun: 10AM-8PM
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-semibold text-orange-300 mobile-text-base">
                  Newsletter
                </h5>
                <p className="text-gray-300 text-sm mobile-text-sm">
                  Get updates on new products and special offers!
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-100 focus:border-yellow-400 rounded-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-white-500 hover:from-yellow-400 hover:to-gray-100 text-black rounded-lg hover:scale-105 transition-all duration-300 mobile-text-sm"
                  >
                    Connect
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 dark:bg-black/50 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2 text-gray-400 text-sm mobile-text-sm">
                <span>© 2025 Metro Cycles & Toys.</span>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400 mobile-text-sm">
                <Link
                  href="/privacy"
                  className="hover:text-yellow-600 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-yellow-600 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/returns"
                  className="hover:text-yellow-600 transition-colors duration-300"
                >
                  Returns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={scrollToTop}
        className="fixed bottom-20 right-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </footer>
  );
}