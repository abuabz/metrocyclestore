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
import Image from "next/image";

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
          to: "metrotoysstore@gmail.com",
        }),
      });
      console.log("Newsletter subscription:", email);
      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
    }
  };

  return (
    <footer className="bg-slate-100 border-t border-slate-200 pt-16 pb-8 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Image
          src="/footerlogobg.png"
          alt="Watermark"
          fill
          className="object-cover opacity-5"
        />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="block">
              <img
                src="/LogomainFav.png"
                alt="Metro Toys & Cycles"
                className="h-12 w-auto object-contain mix-blend-multiply"
              />
            </Link>
            <p className="text-slate-600 leading-relaxed text-sm">
              Bringing joy and adventure to families through our carefully
              curated collection of premium cycles and educational toys since
              2010.
            </p>

            <div className="flex space-x-3">
              <Link href="https://www.facebook.com/share/1BSkQxcTpm/?mibextid=wwXIfr" target="_blank">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white border-slate-200 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white transition-all shadow-sm"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://www.instagram.com/metro.toys_?igsh=MWh2a2kwc2hxa240MA%3D%3D&utm_source=qr" target="_blank">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white border-slate-200 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white transition-all shadow-sm"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://wa.me/+918714583859" target="_blank">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white border-slate-200 hover:bg-yellow-400 hover:border-yellow-400 hover:text-white transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-yellow-600 transition-colors text-sm hover:translate-x-1 inline-block transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories & Services */}
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
            <ul className="space-y-4">
              {productCategories.slice(0, 5).map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-slate-600 hover:text-yellow-600 transition-colors text-sm hover:translate-x-1 inline-block transform"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {services.slice(0, 2).map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-slate-600 hover:text-yellow-600 transition-colors text-sm hover:translate-x-1 inline-block transform"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 mb-6">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm text-slate-600">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span>Airport Road Padikkal, Chelari, Malappuram, Kerala</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                <a href="tel:+918714583859" className="hover:text-slate-900 transition-colors">+91 87145 83859</a>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                <a href="mailto:metrotoysstore@gmail.com" className="hover:text-slate-900 transition-colors">metrotoysstore@gmail.com</a>
              </div>
            </div>

            <div className="pt-4">
              <h5 className="font-bold text-slate-900 text-sm mb-2">Newsletter</h5>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-slate-200 focus:border-yellow-400 focus:ring-yellow-100 rounded-lg text-sm shadow-sm"
                  required
                />
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-yellow-500 text-white hover:text-slate-900 font-bold rounded-lg transition-colors shadow-md"
                >
                  Join
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Metro Toys & Cycles. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-900 text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-900 text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      <Button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-white hover:bg-yellow-400 text-black border border-slate-100 shadow-lg hover:shadow-xl rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all duration-300 z-40 group"
      >
        <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
      </Button>
    </footer>
  );
}