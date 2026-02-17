"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Wrench, Palette, Truck, Shield, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/light-header"
import Image from "next/image"
import Footer from "@/components/footer"
import ScrollReveal from "@/components/ui/scroll-reveal"

// Define types for services and service images
interface Service {
  icon: React.ReactNode
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
    icon: <Wrench className="w-10 h-10" />,
    title: "Repair Services",
    description: "Professional repair services for all types of cycles and toys",
    features: ["Quick turnaround", "Genuine parts", "Expert technicians", "Warranty included"],
    price: "Starting from ₹49",
  },
  {
    icon: <Palette className="w-10 h-10" />,
    title: "Customization",
    description: "Personalize your bikes and toys with custom colors and designs",
    features: ["Custom paint jobs", "Decal application", "Accessory installation", "Design consultation"],
    price: "Starting from ₹99",
  },
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Delivery & Assembly",
    description: "Free delivery and professional assembly for your convenience",
    features: ["Free local delivery", "Professional assembly", "Setup instruction", "Safety check"],
    price: "Free on orders ₹499+",
  },
  {
    icon: <Shield className="w-10 h-10" />,
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
  "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam",
  "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta",
  "Thiruvananthapuram", "Thrissur", "Wayanad"
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
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-200">
      <Header />

      {/* Custom Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold">Error</span>
              <span className="ml-2">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white hover:text-gray-200 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section - New Design */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/services.jpeg"
            alt="Services Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <ScrollReveal animation="fade-in-up">
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold mb-8 shadow-lg hover:scale-105 transition-transform">
              <Wrench className="w-4 h-4 text-yellow-500" />
              <span>Premium Care Center</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight">
              Expert Care<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-600">
                Peak Performance
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Experience top-tier maintenance and customization for your cycles and toys. We treat every ride like our own.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => document.getElementById('service-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-black text-white hover:bg-yellow-500 hover:text-black rounded-full px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 min-w-[200px]"
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                className="bg-white text-black border-2 border-black hover:bg-black hover:text-white rounded-full px-10 py-7 text-lg font-bold shadow-md hover:shadow-xl transition-all duration-300 min-w-[200px]"
              >
                View Pricing
              </Button>
            </div>
          </ScrollReveal>

          {/* Floating Cards */}
          <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 -translate-x-12 rotate-[-6deg]">
            <ScrollReveal animation="fade-in-right" delay={300}>
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float border border-gray-100">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Quick Repair</p>
                  <p className="text-xs text-gray-500">Same day delivery</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="hidden md:block absolute top-1/3 right-0 translate-x-12 rotate-[6deg]">
            <ScrollReveal animation="fade-in-left" delay={400}>
              <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed border border-gray-100">
                <div className="bg-black p-2 rounded-full">
                  <Palette className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Custom Mods</p>
                  <p className="text-xs text-gray-500">Expert design</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Professional Services</h2>
            <p className="text-gray-500">Comprehensive care for every need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100} enableReAnimate={false}>
                <Card className="h-full border-gray-100 bg-slate-50 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="bg-white p-4 rounded-2xl shadow-sm text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="space-y-3">
                          {service.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-3 text-sm text-gray-600">
                              <CheckCircle2 className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service Request Form */}
      <section id="service-form" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-100/40 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <Badge className="bg-white text-gray-900 border-gray-200 mb-4 px-4 py-1 text-sm shadow-sm">Get Started</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Request a Service</h2>
            <p className="text-gray-500">Fill out the form below and we'll get back to you shortly.</p>
          </div>

          <ScrollReveal animation="fade-in-up" enableReAnimate={false}>
            <Card className="border-0 bg-white shadow-xl rounded-[2rem] overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">Full Name</label>
                      <Input
                        name="M07_name"
                        value={formData.M07_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">Phone Number</label>
                      <Input
                        name="M07_phone_number"
                        value={formData.M07_phone_number}
                        onChange={handleInputChange}
                        type="tel"
                        placeholder="+91 98765 43210"
                        className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">Place / City</label>
                      <Input
                        name="M07_place"
                        value={formData.M07_place}
                        onChange={handleInputChange}
                        placeholder="e.g. Kozhikode"
                        className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">District</label>
                      <Select onValueChange={handleDistrictChange} value={formData.M07_district} required>
                        <SelectTrigger className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl">
                          {keralaDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 ml-1">Pincode</label>
                    <Input
                      name="M07_pincode"
                      value={formData.M07_pincode}
                      onChange={handleInputChange}
                      placeholder="673xxx"
                      className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-yellow-500 focus:border-yellow-500 transition-all font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">Product Images <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-yellow-400 transition-all text-center">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProductImageChange}
                          className="hidden"
                          id="product-images"
                        />
                        <label htmlFor="product-images" className="cursor-pointer flex flex-col items-center gap-2">
                          <div className="bg-white p-3 rounded-full shadow-sm text-yellow-500">
                            <Palette className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Click to upload images</span>
                        </label>
                      </div>

                      {productImages.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                              <Image
                                src={image.preview}
                                alt={`Preview ${index}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveProductImage(index)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 ml-1">Warranty Card <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white hover:border-yellow-400 transition-all text-center">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleWarrantyImageChange}
                          className="hidden"
                          id="warranty-images"
                        />
                        <label htmlFor="warranty-images" className="cursor-pointer flex flex-col items-center gap-2">
                          <div className="bg-white p-3 rounded-full shadow-sm text-yellow-500">
                            <Shield className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Click to upload warranty cards</span>
                        </label>
                      </div>

                      {warrantyImages.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {warrantyImages.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                              <Image
                                src={image.preview}
                                alt={`Preview ${index}`}
                                fill
                                className="object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveWarrantyImage(index)}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-black text-white hover:bg-yellow-500 hover:text-black rounded-xl py-6 text-lg font-bold shadow-lg transition-transform hover:scale-[1.02]"
                  >
                    Submit Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Service Images */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Work in Action</h2>
            <p className="text-gray-500">See the quality we deliver.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceImages.map((image, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100} enableReAnimate={false}>
                <div className="group relative h-80 rounded-[2rem] overflow-hidden shadow-md cursor-pointer">
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2">{image.title}</h3>
                    <div className="h-1 w-12 bg-yellow-500 rounded-full" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}