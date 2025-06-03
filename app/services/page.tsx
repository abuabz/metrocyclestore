"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Wrench, Palette, Truck, Shield, Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import Footer from "@/components/footer"

const services = [
  {
    icon: <Wrench className="w-12 h-12" />,
    title: "Repair Services",
    description: "Professional repair services for all types of cycles and toys",
    features: ["Quick turnaround", "Genuine parts", "Expert technicians", "Warranty included"],
    price: "Starting from $15",
  },
  {
    icon: <Palette className="w-12 h-12" />,
    title: "Customization",
    description: "Personalize your bikes and toys with custom colors and designs",
    features: ["Custom paint jobs", "Decal application", "Accessory installation", "Design consultation"],
    price: "Starting from $25",
  },
  {
    icon: <Truck className="w-12 h-12" />,
    title: "Delivery & Assembly",
    description: "Free delivery and professional assembly for your convenience",
    features: ["Free local delivery", "Professional assembly", "Setup instruction", "Safety check"],
    price: "Free on orders $50+",
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: "Extended Warranty",
    description: "Extended protection plans for your valuable purchases",
    features: ["Extended coverage", "Accident protection", "Priority service", "Replacement guarantee"],
    price: "Starting from $10",
  },
]

const serviceImages = [
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Bike repair service",
    title: "Professional Bike Repair",
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Toy maintenance",
    title: "Toy Maintenance & Care",
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Custom paint job",
    title: "Custom Paint Services",
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Assembly service",
    title: "Professional Assembly",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing repair service! They fixed my daughter's bike perfectly and it looks brand new.",
    service: "Repair Services",
  },
  {
    name: "Mike Chen",
    rating: 5,
    comment: "The custom paint job on my son's bike exceeded our expectations. Highly recommended!",
    service: "Customization",
  },
  {
    name: "Emma Davis",
    rating: 5,
    comment: "Free delivery and assembly made our purchase so convenient. Great service!",
    service: "Delivery & Assembly",
  },
]

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState({})

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <Image src="/placeholder.svg?height=300&width=1200" alt="Services Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-pink-900/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up mobile-text-2xl">
              Our Services
            </h1>
            <p className="text-base md:text-lg lg:text-xl animate-fade-in-up animation-delay-300 mobile-text-base">
              Professional services to keep your cycles and toys in perfect condition
            </p>
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section
        id="service-form"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["service-form"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Request a Service
          </h2>
          <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Full Name
                    </label>
                    <Input
                      placeholder="Enter your full name"
                      className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Contact Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Service Needed
                  </label>
                  <select className="w-full border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="">Select a service</option>
                    <option value="repair">Repair Services</option>
                    <option value="customization">Customization</option>
                    <option value="delivery">Delivery & Assembly</option>
                    <option value="warranty">Extended Warranty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Message
                  </label>
                  <Textarea
                    placeholder="Describe your service request..."
                    rows={6}
                    className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 mobile-text-base"
                  >
                    Submit Request
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Grid */}
      <section
        id="services-grid"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["services-grid"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Professional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 ${
                  isVisible["services-grid"]
                    ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="text-purple-600 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-purple-600 transition-colors duration-300 mobile-text-lg">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed mobile-text-sm">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {service.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400 mobile-text-sm"
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="text-lg md:text-xl font-bold text-purple-600 mobile-text-base">
                        {service.price}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Service Images */}
      <section
        id="service-images"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["service-images"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Work in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceImages.map((image, index) => (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                  isVisible["service-images"]
                    ? `opacity-100 transform scale-100 transition-delay-[${index * 150}ms]`
                    : "opacity-0 transform scale-95"
                } transition-all duration-500`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg md:text-xl font-bold mobile-text-base">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["testimonials"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  isVisible["testimonials"]
                    ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic mobile-text-sm">"{testimonial.comment}"</p>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mobile-text-sm">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mobile-text-sm">{testimonial.service}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
