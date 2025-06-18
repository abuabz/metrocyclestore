"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Wrench, Palette, Truck, Shield } from "lucide-react"
import { Input as InputComponent } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Image from "next/image"
import Footer from "@/components/footer"

// Define types for services and service images
interface Service {
  icon: JSX.Element
  title: string
  description: string
  features: string[]
  price: string
}

interface ServiceImage {
  src: string
  alt: string
  title: string
}

const services: Service[] = [
  {
    icon: <Wrench className="w-12 h-12" />,
    title: "Repair Services",
    description: "Professional repair services for all types of cycles and toys",
    features: ["Quick turnaround", "Genuine parts", "Expert technicians", "Warranty included"],
    price: "Starting from ₹49",
  },
  {
    icon: <Palette className="w-12 h-12" />,
    title: "Customization",
    description: "Personalize your bikes and toys with custom colors and designs",
    features: ["Custom paint jobs", "Decal application", "Accessory installation", "Design consultation"],
    price: "Starting from ₹99",
  },
  {
    icon: <Truck className="w-12 h-12" />,
    title: "Delivery & Assembly",
    description: "Free delivery and professional assembly for your convenience",
    features: ["Free local delivery", "Professional assembly", "Setup instruction", "Safety check"],
    price: "Free on orders ₹499+",
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: "Extended Warranty",
    description: "Extended protection plans for your valuable purchases",
    features: ["Extended coverage", "Accident protection", "Priority service", "Replacement guarantee"],
    price: "Starting from ₹99",
  },
]

const serviceImages: ServiceImage[] = [
  {
    src: "./assets/service_02.jpeg",
    alt: "Bike repair service",
    title: "Professional Bike Repair",
  },
  {
    src: "./assets/service_01.jpg",
    alt: "Toy maintenance",
    title: "Toy Maintenance & Care",
  },
  {
    src: "./assets/service_03.png",
    alt: "Custom paint job",
    title: "Custom Paint Services",
  },
  {
    src: "./assets/service_04.jpg",
    alt: "Assembly service",
    title: "Professional Assembly",
  },
]

// Kerala districts list
const keralaDistricts = [
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad"
]

// Define types for form data and image state
interface FormData {
  M07_name: string
  M07_place: string
  M07_district: string
  M07_pincode: string
  M07_phone_number: string
}

interface ImageData {
  file: File
  preview: string
}

export default function ServicesPage() {
  // Type for isVisible state
  const [isVisible, setIsVisible] = useState<{
    "service-form"?: boolean
    "services-grid"?: boolean
    "service-images"?: boolean
  }>({})

  const [formData, setFormData] = useState<FormData>({
    M07_name: "",
    M07_place: "",
    M07_district: "",
    M07_pincode: "",
    M07_phone_number: "",
  })

  const [productImages, setProductImages] = useState<ImageData[]>([])
  const [warrantyImages, setWarrantyImages] = useState<ImageData[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => {
      setToastMessage(null)
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDistrictChange = (value: string) => {
    setFormData((prev) => ({ ...prev, M07_district: value }))
  }

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setProductImages((prev) => [...prev, ...newImages])
    }
  }

  const handleWarrantyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setWarrantyImages((prev) => [...prev, ...newImages])
    }
  }

  const handleRemoveProductImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveWarrantyImage = (index: number) => {
    setWarrantyImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const submissionData = new FormData()
    submissionData.append("M07_name", formData.M07_name)
    submissionData.append("M07_place", formData.M07_place)
    submissionData.append("M07_district", formData.M07_district)
    submissionData.append("M07_pincode", formData.M07_pincode)
    submissionData.append("M07_phone_number", formData.M07_phone_number)
    submissionData.append("M07_status", "To do")

    productImages.forEach((image, index) => {
      submissionData.append(`M07_cycle_image`, image.file)
    })

    warrantyImages.forEach((image, index) => {
      submissionData.append(`M07_warranty_card_photo`, image.file)
    })

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/contact`, {
        method: "POST",
        body: submissionData,
      })

      const result = await response.json()

      if (result.success) {
        const contactId = result.data.contactId
        const whatsappMessage = `New service Request\nContact ID: *${contactId}*`
        const whatsappUrl = `https://wa.me/918714583859?text=${encodeURIComponent(whatsappMessage)}`
        window.open(whatsappUrl, "_blank")

        setFormData({
          M07_name: "",
          M07_place: "",
          M07_district: "",
          M07_pincode: "",
          M07_phone_number: "",
        })
        setProductImages([])
        setWarrantyImages([])
      } else {
        throw new Error(result.msg || "Failed to create contact")
      }
    } catch (error: any) {
      showToast(error.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Custom Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Error</span>
              <span className="ml-2">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden">
        <Image src="./assets/services.jpeg" alt="Services Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/70 to-black/50" />
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
        className={`md:py-20 py-10 px-4 transition-all duration-1000 ${isVisible["service-form"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Request a Service
          </h2>
          <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Full Name
                    </label>
                    <InputComponent
                      name="M07_name"
                      value={formData.M07_name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Contact Number
                    </label>
                    <InputComponent
                      name="M07_phone_number"
                      value={formData.M07_phone_number}
                      onChange={handleInputChange}
                      type="tel"
                      placeholder="Enter your phone number"
                      className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Place
                    </label>
                    <InputComponent
                      name="M07_place"
                      value={formData.M07_place}
                      onChange={handleInputChange}
                      placeholder="Enter your place"
                      className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      District
                    </label>
                    <Select onValueChange={handleDistrictChange} value={formData.M07_district} required>
                      <SelectTrigger className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700">
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        {keralaDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Pincode
                  </label>
                  <InputComponent
                    name="M07_pincode"
                    value={formData.M07_pincode}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter your pincode"
                    className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Product Images (Optional)
                  </label>
                  <InputComponent
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageChange}
                    className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                  />
                  {productImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.preview}
                            alt={`Product Preview ${index}`}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProductImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                    Warranty Card Images (Optional)
                  </label>
                  <InputComponent
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleWarrantyImageChange}
                    className="border-purple-200 dark:border-yellow-700 focus:border-yellow-500 focus:ring-yellow-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                  />
                  {warrantyImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {warrantyImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.preview}
                            alt={`Warranty Preview ${index}`}
                            width={150}
                            height={150}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveWarrantyImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-white hover:from-white hover:to-yellow-500 text-black px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 mobile-text-base"
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
        className={`md:py-20 py-10 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${isVisible["services-grid"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
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
                className={`group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 ${isVisible["services-grid"]
                  ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                  : "opacity-0 transform translate-y-8"
                  }`}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="text-yellow-500 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-yellow-500 transition-colors duration-300 mobile-text-lg">
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
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
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
        className={`md:py-20 py-10 px-4 transition-all duration-1000 ${isVisible["service-images"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
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
                className={`group relative overflow-hidden rounded-lg cursor-pointer ${isVisible["service-images"]
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
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg md:text-xl font-bold mobile-text-base">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}