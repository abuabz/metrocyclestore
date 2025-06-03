"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Globe, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    details: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
    description: "Call us anytime during business hours",
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    details: ["info@cyclesandtoys.com", "support@cyclesandtoys.com"],
    description: "We'll respond within 24 hours",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Address",
    details: ["123 Toy Street", "Fun City, FC 12345"],
    description: "Visit our beautiful showroom",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Business Hours",
    details: ["Mon-Sat: 9AM-7PM", "Sun: 10AM-6PM"],
    description: "Extended weekend hours",
  },
]

const features = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Expert Support",
    description: "Our knowledgeable team is here to help with product selection and technical support.",
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Quick Response",
    description: "We pride ourselves on fast response times and excellent customer service.",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Multiple Channels",
    description: "Reach us via phone, email, chat, or visit our store - whatever works best for you.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isVisible, setIsVisible] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image src="/placeholder.svg?height=400&width=1200" alt="Contact Us Hero" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-pink-900/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up mobile-text-3xl">
              Get In Touch
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl animate-fade-in-up animation-delay-300 mobile-text-lg">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Features */}
      <section
        id="contact-features"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["contact-features"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Why Choose Our Support?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`text-center group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 ${
                  isVisible["contact-features"]
                    ? `opacity-100 transform translate-y-0 transition-delay-[${index * 100}ms]`
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                <CardContent className="p-8">
                  <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3 group-hover:text-purple-600 transition-colors duration-300 mobile-text-base">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section
        id="contact-main"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["contact-main"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-xl">
                  Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed mb-8 mobile-text-base">
                  Have questions about our products or services? We're here to help! Reach out to us through any of the
                  following channels, and our friendly team will get back to you promptly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    className="border-0 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="text-purple-600 mt-1">{info.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 mobile-text-sm">
                            {info.title}
                          </h3>
                          {info.details.map((detail, detailIndex) => (
                            <p
                              key={detailIndex}
                              className="text-gray-600 dark:text-gray-300 text-sm mb-1 mobile-text-sm"
                            >
                              {detail}
                            </p>
                          ))}
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 mobile-text-sm">
                            {info.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full py-4 transform hover:scale-105 transition-all duration-300 mobile-text-base"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-full py-4 transform hover:scale-105 transition-all duration-300 mobile-text-base"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Live Chat
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-2xl">
                <CardContent className="p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center mobile-text-lg">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                          Email Address *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                          Subject *
                        </label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What's this about?"
                          className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg h-12 bg-white dark:bg-gray-700"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        className="border-purple-200 dark:border-purple-700 focus:border-purple-500 focus:ring-purple-500 rounded-lg bg-white dark:bg-gray-700"
                        required
                      />
                    </div>

                    <div className="text-center">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-full transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mobile-text-base"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section
        id="map-section"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["map-section"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Find Our Store
          </h2>
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-2 h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123456789!2d-74.0059413!3d40.7127753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1234567890123"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Store Location"
                  />
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold mb-6 mobile-text-lg">Visit Our Showroom</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5" />
                      <div>
                        <p className="font-medium mobile-text-sm">123 Toy Street</p>
                        <p className="text-purple-100 mobile-text-sm">Fun City, FC 12345</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5" />
                      <div>
                        <p className="font-medium mobile-text-sm">Store Hours</p>
                        <p className="text-purple-100 mobile-text-sm">Mon-Sat: 9AM-7PM</p>
                        <p className="text-purple-100 mobile-text-sm">Sun: 10AM-6PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5" />
                      <div>
                        <p className="font-medium mobile-text-sm">Call for Directions</p>
                        <p className="text-purple-100 mobile-text-sm">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6 border-white text-white hover:bg-white hover:text-purple-600 rounded-full mobile-text-sm"
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq-section"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["faq-section"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "What are your return policies?",
                answer: "We offer a 30-day return policy on all items in original condition.",
              },
              {
                question: "Do you offer assembly services?",
                answer: "Yes! We provide free assembly service for purchases over $50.",
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and cash for in-store purchases.",
              },
              {
                question: "Do you have a warranty on products?",
                answer: "All our products come with a 1-year manufacturer warranty.",
              },
            ].map((faq, index) => (
              <Card
                key={index}
                className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 mobile-text-sm">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mobile-text-sm">
                    {faq.answer}
                  </p>
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
