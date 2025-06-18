"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { VideoModal, VideoThumbnail } from "@/components/video-modal";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

// New Image Modal Component
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative max-w-4xl w-full p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-gray-800/70 hover:bg-gray-800 rounded-full p-2"
        >
          ✕
        </button>
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

const heroSlides = [
  {
    id: 1,
    title: "Adventure Awaits!",
    subtitle: "Discover our amazing collection of cycles and toys",
    image:
      "https://images.pexels.com/photos/35619/capri-ford-oldtimer-automotive.jpg?cs=srgb&dl=pexels-pixabay-35619.jpg&fm=jpg",
    cta: "Shop Now",
  },
  {
    id: 2,
    title: "Premium Cycles",
    subtitle: "Quality bikes for every age and adventure",
    image:
      "https://plus.unsplash.com/premium_photo-1685207267343-1c8852b45575?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3ljbGluZ3xlbnwwfHwwfHx8MA%3D%3D",
    cta: "View Cycles",
  },
  {
    id: 3,
    title: "Fun Toys Collection",
    subtitle: "Bringing joy to children everywhere",
    image:
      "https://plus.unsplash.com/premium_photo-1684795780266-ecd819f04f96?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG95c3xlbnwwfHwwfHx8MA%3D%3D",
    cta: "Explore Toys",
  },
  {
    id: 4,
    title: "Kids Car ",
    subtitle: "Up to 30% off on selected items",
    image:
      "https://t3.ftcdn.net/jpg/02/68/62/42/360_F_268624278_8BbMAUszsyvayoNVnRvgfJoodkqLoxDn.jpg",
    cta: "Get Deals",
  },
];

const services = [
  {
    icon: <Wrench className="w-8 h-8" />,
    title: "Repair Services",
    description: "Professional bike and toy repair services",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Customization",
    description: "Personalize your bikes and toys",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Free Delivery",
    description: "Free delivery on orders over ₹499",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Warranty",
    description: "6 Month warranty on Limited products",
  },
];

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]); // State for gallery items
  const [error, setError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null); // Separate error state for gallery

  // Fetch featured products from the API
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

  // Fetch gallery items from the API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/gallery`);
        const result: GalleryApiResponse = await response.json();

        if (result.success) {
          // Filter active items and take only the first 6
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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Hero Carousel */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
              ? "opacity-100 transform translate-x-0"
              : index < currentSlide
                ? "opacity-0 transform -translate-x-full"
                : "opacity-0 transform translate-x-full"
              }`}
          >
            <div className="relative h-full">
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/70 to-[#000000c7]" />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="max-w-4xl px-4">
                  <h1
                    className={`text-3xl md:text-5xl lg:text-7xl font-bold mb-6 transition-all duration-1000 delay-300 mobile-text-3xl ${index === currentSlide
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-8"
                      }`}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={`text-lg md:text-xl lg:text-2xl mb-8 transition-all duration-1000 delay-500 mobile-text-lg ${index === currentSlide
                      ? "opacity-100 transform translate-y-0"
                      : "opacity-0 transform translate-y-8"
                      }`}
                  >
                    {slide.subtitle}
                  </p>
                  {/* <Button
                    size="lg"
                    className={`bg-gradient-to-r from-yellow-500 to-white-800 hover:from-yellow-600 hover:to-gray-50 px-8 py-4 text-lg text-black rounded-full transform transition-all duration-1000 delay-700 hover:scale-105 mobile-text-base ${index === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                      }`}
                  >
                    {slide.cta}
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
                }`}
            />
          ))}
        </div>
      </section>

      {/* Mini About Us */}
      <section
        id="about-mini"
        data-animate
        className={`md:py-20 py-10 px-4 transition-all duration-1000 ${isVisible["about-mini"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-yellow-400 mb-6 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mobile-text-2xl">
            Welcome to Cycles & Toys Paradise
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-base">
            For over a decade, we've been bringing joy and adventure to families
            through our carefully curated collection of premium cycles and
            educational toys. Our mission is to inspire outdoor activities and
            creative play for children of all ages.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="featured-products"
        data-animate
        className={`md:py-20 py-10 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${isVisible["featured-products"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent mobile-text-2xl">
            Featured Products
          </h2>
          {error && (
            <p className="text-center text-red-500 mb-4">{error}</p>
          )}
          {featuredProducts.length === 0 && !error && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Loading featured products...
            </p>
          )}
          {featuredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card
                    className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 overflow-hidden cursor-pointer flex flex-col h-full ${isVisible["featured-products"]
                      ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                      : "opacity-0 transform translate-y-8"
                      }`}
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-yellow-200 mb-2 group-hover:text-yellow-500 transition-colors duration-300 mobile-text-base">
                          {product.name}
                        </h3>
                        <div className="mb-4 h-12">
                          <p className="dark:text-gray-300 text-gray-800 line-clamp-2 overflow-hidden text-ellipsis">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-2 items-center">
                            <span className="text-xl flex items-center gap-3 md:text-xl font-bold text-yellow-500 mobile-text-lg">
                              ₹{product.price}
                            </span>
                            <span className="text-base md:text-base text-gray-500 dark:text-gray-400 line-through mobile-text-base">
                              ₹{product.originalPrice}
                            </span>
                          </div>
                          <Badge className="bg-red-500 text-white">
                            Save ₹{product.originalPrice - product.price}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Our Services */}
      <section
        id="services"
        data-animate
        className={`md:py-20 py-10 px-4 transition-all duration-1000 ${isVisible["services"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 ${isVisible["services"]
                  ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                  : "opacity-0 transform translate-y-8"
                  }`}
              >
                <CardContent className="p-8 cursor-pointer">
                  <div className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {service.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-yellow-500 transition-colors duration-300 mobile-text-base">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery with Videos and Images */}
      <section
        id="gallery"
        data-animate
        className={`md:py-20 py-10 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${isVisible["gallery"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Gallery
          </h2>
          {galleryError && (
            <p className="text-center text-red-500 mb-4">{galleryError}</p>
          )}
          {galleryItems.length === 0 && !galleryError && (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Loading gallery items...
            </p>
          )}
          {galleryItems.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item, index) => (
                <div
                  key={item._id}
                  className={`${isVisible["gallery"]
                    ? `opacity-100 transform scale-100 transition-delay-[${index * 100}ms]`
                    : "opacity-0 transform scale-95"
                    } transition-all duration-500`}
                >
                  {item.M06_media_type === "image" ? (
                    <div
                      className="group relative overflow-hidden rounded-lg cursor-pointer"
                      onClick={() =>
                        setSelectedImage({
                          src: item.M06_media_url,
                          alt: `Gallery image ${index + 1}`,
                        })
                      }
                    >
                      <Image
                        src={item.M06_media_url || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <VideoThumbnail
                      videoSrc={item.M06_media_url}
                      thumbnailSrc={item?.M06_thumbnail} // Fallback thumbnail since API doesn't provide one
                      title={`Gallery video ${index + 1}`}
                      onClick={() =>
                        setSelectedVideo({
                          src: item.M06_media_url,
                          title: `Gallery video ${index + 1}`,
                        })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Get In Touch */}
      <section
        id="contact-form"
        data-animate
        className={`md:py-20 py-10 px-4 transition-all duration-1000 ${isVisible["contact-form"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Get In Touch
          </h2>
          <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl">
            <CardContent className="md:p-8 p-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-white hover:from-white hover:to-yellow-700 text-black px-12 md:py-4 py-3 rounded-full transform hover:scale-105 transition-all duration-300 mobile-text-base"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Map Integration */}
      <section
        id="map"
        data-animate
        className={`md:py-20 py-10 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${isVisible["map"]
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Visit Our Store
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Link
                href="https://maps.app.goo.gl/rmXMcXU5K8omi7BG9"
                className="flex items-center space-x-4"
              >
                <MapPin className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-base">
                    Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                    Airport Road Padikkal, Chelari, Malappuram.
                  </p>
                </div>
              </Link>
              <Link
                href="tel:+918714583859"
                className="flex items-center space-x-4"
              >
                <Phone className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-base">
                    Phone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                    +91 87145 83859
                  </p>
                </div>
              </Link>
              <Link
                href="mailto:metrotoysstore@gmail.com"
                className="flex items-center space-x-4"
              >
                <Mail className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-base">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                    metrotoysstore@gmail.com
                  </p>
                </div>
              </Link>
              <div className="flex items-center space-x-4">
                <Clock className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-base">
                    Business Hours
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                    Mon-Sat: 9AM-8PM, Sun: 10AM-8PM
                  </p>
                </div>
              </div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.20862869316!2d75.89698147480979!3d11.097823189071146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6530dea0f169d%3A0xb959c2b18a78a6c6!2sMetro%20toys%20padikkal!5e0!3m2!1sen!2sin!4v1748973014399!5m2!1sen!2sin"
                width="600"
                height="450"
                allowFullScreen
                loading="lazy"
                referrerPolicy=""
              />
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

      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Button
          size="lg"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 mobile-text-base"
          onClick={() => window.open('https://wa.me/+918714583859', '_blank')}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
