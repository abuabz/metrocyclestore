"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Wrench,
  Palette,
  Truck,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Users,
  Zap,
  Check,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { VideoModal, VideoThumbnail } from "@/components/video-modal";
import Header from "@/components/light-header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import SeasonalSaleModal from "@/components/SeasonalSaleModal";
import ScrollReveal from "@/components/ui/scroll-reveal";

// Define interface for the featured product based on API response
interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
}

// Define interface for API response (Featured Products)
interface ProductSku {
  _id: string;
  M06_product_sku_name: string;
  M06_price: number;
  M06_MRP: number;
  M06_thumbnail_image: string;
  M06_description: string;
}

interface ApiResponse {
  success: boolean;
  msg: string;
  data: {
    products_skus: ProductSku[];
  };
}

// Define interface for gallery item based on API response
interface GalleryItem {
  _id: string;
  M06_media_type: "image" | "video";
  M06_media_url: string;
  M06_thumbnail: "image";
  M06_is_active: number;
  M06_deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
}

// Define interface for gallery API response
interface GalleryApiResponse {
  success: boolean;
  msg: string;
  data: GalleryItem[];
}

// Define interface for product category
interface ProductCategory {
  _id: string;
  M04_category_name: string;
  M04_image: string | null;
  M04_is_active: number;
  M04_deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  M04_M04_parent_category_id: string | null;
}

interface CategoryApiResponse {
  success: boolean;
  msg: string;
  data: {
    productCategories: ProductCategory[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      limit: number;
    };
  };
  statusCode: number;
}

// Image Modal Component
const ImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="relative max-w-5xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          width={1200}
          height={800}
          className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

const heroSlides = [
  {
    id: 1,
    title: "Play & Grow",
    subtitle: "Premium Toys & Cycles",
    image: "/hero-images/hero1.png",
    cta: "Shop Now",
    badges: [
      {
        icon: "Users",
        title: "1K+ Happy",
        subtitle: "Customers",
        position: "top-28 right-4 md:top-1/4 md:right-16",
        color: "bg-yellow-400",
        animation: "animate-float"
      },
      {
        icon: "Star",
        title: "4.9/5 Rating",
        subtitle: "Top Rated",
        position: "bottom-4 left-4 md:bottom-1/3 md:left-16",
        color: "bg-green-500",
        animation: "animate-float-slow"
      }
    ]
  },
  {
    id: 2,
    title: "Ride in Style",
    subtitle: "Quality Bikes for All",
    image: "/hero-images/hero2.png",
    cta: "View Cycles",
    badges: [
      {
        icon: "Shield",
        title: "Durable",
        subtitle: "2 Year Warranty",
        position: "top-28 left-4 md:top-1/3 md:left-20",
        color: "bg-blue-500",
        animation: "animate-float"
      },
      {
        icon: "Users",
        title: "500+ Riders",
        subtitle: "Community",
        position: "bottom-4 right-4 md:bottom-1/4 md:right-20",
        color: "bg-purple-500",
        animation: "animate-float-slow"
      }
    ]
  },
  {
    id: 3,
    title: "Pure Joy",
    subtitle: "Toys for Every Child",
    image: "/hero-images/hero3.png",
    cta: "Explore Toys",
    badges: [
      {
        icon: "Star",
        title: "Best Seller",
        subtitle: "Kids Favorite",
        position: "top-32 right-4 md:top-20 md:right-24",
        color: "bg-red-500",
        animation: "animate-float-slow"
      },
      {
        icon: "Check",
        title: "Non-Toxic",
        subtitle: "Certified Safe",
        position: "bottom-8 left-4 md:bottom-32 md:left-24",
        color: "bg-green-400",
        animation: "animate-float"
      }
    ]
  },
  {
    id: 4,
    title: "Cool Rides",
    subtitle: "Kids Electric Cars",
    image: "/hero-images/hero4.png",
    cta: "See Deals",
    badges: [
      {
        icon: "Zap",
        title: "Long Lasting",
        subtitle: "Power Battery",
        position: "top-28 left-4 md:top-1/3 md:left-32",
        color: "bg-yellow-500",
        animation: "animate-float"
      },
      {
        icon: "Truck",
        title: "Free Shipping",
        subtitle: "On this item",
        position: "bottom-8 right-4 md:bottom-20 md:right-32",
        color: "bg-orange-500",
        animation: "animate-float-slow"
      }
    ]
  },
  {
    id: 5,
    title: "Stay Safe",
    subtitle: "Helmets & Gear",
    image: "/hero-images/hero5.png",
    cta: "Shop Safety",
    badges: [
      {
        icon: "Shield",
        title: "Certified",
        subtitle: "ISI Marked",
        position: "top-32 right-4 md:top-24 md:right-40",
        color: "bg-emerald-500",
        animation: "animate-float-slow"
      },
      {
        icon: "Users",
        title: "Trusted",
        subtitle: "By Parents",
        position: "bottom-8 left-4 md:bottom-40 md:left-40",
        color: "bg-indigo-500",
        animation: "animate-float"
      }
    ]
  },
];

const services = [
  {
    icon: <Wrench className="w-6 h-6" />,
    title: "Expert Repair",
    description: "Professional Service",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "Customization",
    description: "Make it Yours",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "Free over ₹499",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Warranty",
    description: "6 Month Coverage",
  },
];

const saleData = {
  imageSrc: "./assets/onamoffer.jpeg",
  title: "Seasonal Sale!",
  description: "Up to 40% Off",
  buttonLink: "/products",
  buttonText: "Shop Now",
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [selectedVideo, setSelectedVideo] = useState<{
    src: string;
    title: string;
  } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/featured-products`);
        const result: ApiResponse = await response.json();

        if (result.success) {
          const products = result.data.products_skus.slice(0, 4).map((sku) => ({
            id: sku._id,
            name: sku.M06_product_sku_name,
            price: sku.M06_price,
            originalPrice: sku.M06_MRP,
            image: sku.M06_thumbnail_image,
            description: sku.M06_description,
          }));
          setFeaturedProducts(products);
        } else {
          throw new Error(result.msg || "Failed to fetch featured products");
        }
      } catch (err: any) {
        setError(err.message || "Error fetching featured products");
        console.error("Error fetching featured products:", err);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/gallery`);
        const result: GalleryApiResponse = await response.json();

        if (result.success) {
          const activeItems = result.data
            .filter((item) => item.M06_is_active === 1 && !item.M06_deleted_at)
            .slice(0, 6);
          setGalleryItems(activeItems);
        } else {
          throw new Error(result.msg || "Failed to fetch gallery items");
        }
      } catch (err: any) {
        setGalleryError(err.message || "Error fetching gallery items");
        console.error("Error fetching gallery items:", err);
      }
    };

    fetchGalleryItems();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-category?limit=30`);
        if (!response.ok) {
          throw new Error('Failed to fetch product categories');
        }
        const data: CategoryApiResponse = await response.json();
        if (data.success) {
          const childCategories = data.data.productCategories.filter(
            (category) => category.M04_M04_parent_category_id !== null
          );
          setCategories(childCategories);
        } else {
          throw new Error(data.msg || 'API returned unsuccessful response');
        }
      } catch (err: any) {
        setCategoryError(err.message || 'Error fetching categories');
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `New Contact Form Submission\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    );
    const whatsappUrl = `https://wa.me/+918714583859?text=${whatsappMessage}`;

    try {
      window.open(whatsappUrl, "_blank");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const heroRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current || !spotlightRef.current) return;
    // Disable mouse tracking logic on mobile to avoid conflict with auto-animation
    if (window.innerWidth < 768) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.maskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black, transparent)`;
    spotlightRef.current.style.webkitMaskImage = `radial-gradient(circle 300px at ${x}px ${y}px, black, transparent)`;
  };

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    let isIntersecting = true; // Default to true initially

    // Intersection Observer to pause animation when off-screen prevents scroll guttering/stutter
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    const animate = () => {
      // Only animate on mobile AND when visible
      if (!isIntersecting) {
        // If not visible, just verify periodically or wait for observer (observer callback handles state)
        // We still need the loop to resume, or restart it on intersection. 
        // Simpler: Keep loop but skip heavy work.
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (!spotlightRef.current || !heroRef.current || window.innerWidth >= 768) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsed = Date.now() - startTime;
      const rect = heroRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Smooth organic movement - slightly slower for smoother feel
      const x = (width / 2) + (width * 0.25) * Math.sin(elapsed * 0.0008);
      const y = (height / 2) + (height * 0.15) * Math.cos(elapsed * 0.0011);

      spotlightRef.current.style.maskImage = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
      spotlightRef.current.style.webkitMaskImage = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 selection:bg-yellow-200">
      <Header />

      {/* Hero Section - Split Layout for Modern Look */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[100dvh] flex overflow-hidden bg-white pt-20 md:pt-0"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Static Background */}
        <div
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "url('/footerlogobg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        {/* Spotlight Background */}
        <div
          ref={spotlightRef}
          className="absolute inset-0 z-0 opacity-30 md:opacity-15 pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: "url('/footerlogobg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "radial-gradient(circle 300px at -1000px -1000px, black, transparent)",
            WebkitMaskImage: "radial-gradient(circle 300px at -1000px -1000px, black, transparent)",
            willChange: "mask-image" // Hint to browser for optimization
          }}
        />

        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex flex-col md:flex-row transition-opacity duration-1000 ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            {/* Left Content - Text at Bottom on Mobile */}
            <div className="w-full md:w-1/2 flex flex-col justify-end md:justify-center px-6 md:px-20 pb-16 pt-4 md:py-0 z-10 order-2 md:order-1">
              <div className={`transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
                <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-xs md:text-sm mb-2 md:mb-4">
                  Metro Toys & Cycles
                </h2>
                <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-500 mb-6 md:mb-8 max-w-md">
                  {slide.subtitle}
                </p>
                <div className="flex flex-col gap-8">
                  <Link href="/products" className="w-fit">
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-6 rounded-full text-lg transition-transform hover:scale-105">
                      {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>

                  <div className="flex space-x-3">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-3 rounded-full transition-all duration-300 ${index === idx ? "bg-yellow-500 w-8" : "bg-gray-300 w-3 hover:bg-gray-400"
                          }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image - Centered on Mobile */}
            <div className="w-full md:w-1/2 relative flex-1 md:h-full order-1 md:order-2 min-h-0">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-contain p-8 md:p-24 drop-shadow-2xl animate-float-slow"
                priority={index === 0}
              />
              {/* Dynamic Floating Badges */}
              {slide.badges?.map((badge, bIndex) => (
                <div
                  key={bIndex}
                  className={`absolute ${badge.position} bg-white/80 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-2xl ${badge.animation} z-20 flex items-center gap-3 transform hover:scale-105 transition-transform duration-300 border border-white/50 scale-75 md:scale-100 origin-center`}
                >
                  <div className={`${badge.color} p-2 rounded-full text-white shadow-sm`}>
                    {/* Icons */}
                    {badge.icon === "Users" && <Users className="w-4 h-4 md:w-5 md:h-5" />}
                    {badge.icon === "Star" && <Star className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
                    {badge.icon === "Shield" && <Shield className="w-4 h-4 md:w-5 md:h-5" />}
                    {badge.icon === "Zap" && <Zap className="w-4 h-4 md:w-5 md:h-5" />}
                    {badge.icon === "Truck" && <Truck className="w-4 h-4 md:w-5 md:h-5" />}
                    {badge.icon === "Check" && <Check className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs md:text-sm whitespace-nowrap">{badge.title}</h4>
                    {badge.title.includes("Rating") ? (
                      <div className="flex text-yellow-500 text-[10px] space-x-0.5">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                    ) : (
                      <p className="text-[10px] md:text-xs text-gray-600 whitespace-nowrap">{badge.subtitle}</p>
                    )}
                  </div>
                </div>
              ))}

            </div>
          </div>
        ))}

        {/* Navigation Dots */}

      </section>


      {/* Categories Section - Clean Grid */}
      <section className="py-20 px-4 bg-slate-50" id="categories">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center md:justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
            <Link href="/products" className="hidden md:flex items-center text-yellow-600 hover:text-yellow-700 font-semibold">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {categoryError ? (
            <p className="text-center text-red-500">{categoryError}</p>
          ) : categories.length === 0 ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category, idx) => (
                <ScrollReveal key={category._id} animation="fade-in-up" delay={idx * 50} className="h-full">
                  <Link
                    href={`/products?categoryID=${category._id}`}
                    className="group block h-full"
                  >
                    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center h-full border border-gray-100 hover:border-yellow-200">
                      <div className="relative w-24 h-24 mb-4 rounded-xl overflow-hidden bg-white group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={category.M04_image || "/assets/placeholder.jpg"}
                          alt={category.M04_category_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {category.M04_category_name}
                      </h3>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products - White Cards */}
      <section className="py-20 px-4 bg-white" id="featured-products">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 mb-4 px-4 py-1 text-sm">Best Sellers</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Hand-picked favorites for your little ones.</p>
          </div>

          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product, index) => (
                <ScrollReveal key={product.id} animation="fade-in-up" delay={index * 100} className="h-full">
                  <Link href={`/products/${product.id}`} className="block h-full">
                    <Card className="border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden bg-white group rounded-3xl">
                      <div className="relative h-36 md:h-64 bg-gray-50 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-contain p-2 md:p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.originalPrice > product.price && (
                          <Badge className="absolute top-3 left-3 bg-red-500 text-white rounded-md px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                            Sale
                          </Badge>
                        )}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="icon" variant="secondary" className="rounded-full h-8 w-8 hover:bg-yellow-400 hover:text-black transition-colors">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-5">
                        <div className="flex justify-between items-start mb-1 md:mb-2">
                          <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-600 transition-colors w-full pr-1 md:pr-2">{product.name}</h3>
                          <div className="flex items-center gap-0.5 text-yellow-400 text-[10px] md:text-xs font-bold shrink-0 mt-0.5 md:mt-1">
                            <Star className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" /> 4.5
                          </div>
                        </div>
                        <p className="hidden md:block text-gray-500 text-xs mb-4 line-clamp-2 h-10 leading-relaxed">{product.description}</p>

                        <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-2 md:pt-3">
                          <div className="flex flex-col">
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] md:text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                            )}
                            <span className="text-sm md:text-lg font-extrabold text-gray-900">₹{product.price}</span>
                          </div>
                          <Button size="sm" className="bg-black text-white hover:bg-yellow-500 hover:text-black rounded-lg px-2 md:px-4 h-7 md:h-9 text-[10px] md:text-xs font-bold transition-all shadow-lg shadow-gray-200">
                            Buy Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-black hover:bg-yellow-500 text-white hover:text-black font-bold px-10 py-6 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                View All Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section - Individual Cards */}
      <section className="py-12 bg-slate-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100} className="h-full">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center space-x-4 h-full group">
                  <div className="bg-yellow-50 p-3 rounded-full text-yellow-600 shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{service.title}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section - Professional Bento Grid */}
      <section className="py-24 px-4 bg-slate-50" id="gallery">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 mb-4 px-4 py-1 text-sm">Gallery</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Captured Moments</h2>
              <p className="text-gray-500 max-w-xl text-lg">
                Glimpses of joy from our happy customers and store events.
              </p>
            </div>
            <Link href="https://www.instagram.com/metro.toys_/" target="_blank" className="hidden md:flex items-center gap-2 text-gray-900 font-semibold hover:text-yellow-600 transition-colors group">
              <span className="border-b-2 border-transparent group-hover:border-yellow-500 transition-all">View on Instagram</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
            {galleryItems.slice(0, 7).map((item, index) => (
              <ScrollReveal
                key={item._id}
                animation="fade-in-up"
                delay={index * 50}
                className={`relative rounded-3xl overflow-hidden shadow-sm group cursor-pointer border border-white hover:border-yellow-400/50 transition-all duration-300 ${index === 0 ? "col-span-2 row-span-2" :
                  index === 3 ? "col-span-1 row-span-1 md:col-span-2" : "col-span-1 row-span-1"
                  }`}
              >
                <div
                  className="w-full h-full relative bg-gray-100"
                  onClick={() =>
                    item.M06_media_type === "image"
                      ? setSelectedImage({ src: item.M06_media_url, alt: "Gallery" })
                      : setSelectedVideo({ src: item.M06_media_url, title: "Gallery" })
                  }
                >
                  {item.M06_media_type === "image" ? (
                    <>
                      <Image
                        src={item.M06_media_url || "/placeholder.svg"}
                        alt="Gallery"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                          <Palette className="w-6 h-6" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <VideoThumbnail
                      videoSrc={item.M06_media_url}
                      thumbnailSrc={item?.M06_thumbnail}
                      title="Video"
                      onClick={() => setSelectedVideo({ src: item.M06_media_url, title: "Video" })}
                    />
                  )}
                </div>
              </ScrollReveal>
            ))}

            {/* View More Card */}
            <ScrollReveal animation="fade-in-up" delay={400} className="col-span-1 row-span-1 flex h-full">
              <Link href="https://www.instagram.com/metro.toys_/" target="_blank" className="w-full h-full">
                <div className="w-full h-full bg-yellow-400 rounded-3xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-yellow-500 transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative z-10 p-2 bg-white rounded-full text-yellow-600 mb-2 group-hover:scale-110 transition-transform">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <span className="relative z-10 font-bold text-lg text-black">More<br />Stories</span>
                </div>
              </Link>
            </ScrollReveal>
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="https://www.instagram.com/metro.toys_/" target="_blank">
              <Button className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black font-bold py-6 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Instagram className="w-5 h-5 mr-2" />
                View All on Instagram
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Map Section - Combined */}
      <section className="py-20 px-4 bg-white" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Card */}
            <div className="lg:col-span-2 bg-slate-50 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                <ScrollReveal animation="fade-in-up" className="h-full">
                  <div className="p-8 md:p-12 h-full flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <p className="text-gray-500 mb-8">We'd love to hear from you. Drop us a message or visit our store.</p>

                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-yellow-500"><MapPin size={24} /></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Visit Us</h4>
                          <p className="text-sm text-gray-500">Airport Road Padikkal, Chelari, Malappuram</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-yellow-500"><Phone size={24} /></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Call Us</h4>
                          <p className="text-sm text-gray-500">+91 87145 83859</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-yellow-500"><Clock size={24} /></div>
                        <div>
                          <h4 className="font-bold text-gray-900">Open Hours</h4>
                          <p className="text-sm text-gray-500">Mon-Sat: 9AM - 8PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-in-up" className="h-full">
                  <div className="bg-white p-8 md:p-12 border-l border-gray-100 h-full flex flex-col justify-center">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Name"
                          value={name} onChange={(e) => setName(e.target.value)}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                        <Input
                          placeholder="Email"
                          type="email"
                          value={email} onChange={(e) => setEmail(e.target.value)}
                          className="bg-gray-50 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                        />
                      </div>
                      <Textarea
                        placeholder="How can we help?"
                        rows={4}
                        value={message} onChange={(e) => setMessage(e.target.value)}
                        className="bg-gray-50 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
                      />
                      <Button type="submit" size="lg" className="w-full bg-black text-white hover:bg-gray-800">
                        Send Message
                      </Button>
                    </form>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Map Section */}
            <div className="lg:col-span-1 h-full min-h-[400px] rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 bg-slate-50">
              <ScrollReveal animation="fade-in-up" className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 block">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.20862869316!2d75.89698147480979!3d11.097823189071146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6530dea0f169d%3A0xb959c2b18a78a6c6!2sMetro%20toys%20padikkal!5e0!3m2!1sen!2sin!4v1748973014399!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <VideoModal
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        videoSrc={selectedVideo?.src || ""}
        title={selectedVideo?.title || ""}
      />
      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
      />
      {/* <SeasonalSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        saleData={saleData}
      /> */}

      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-2xl transition-transform hover:scale-110"
          onClick={() => window.open("https://wa.me/+918714583859", "_blank")}
        >
          <MessageCircle className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}