"use client"

import { useState, useEffect } from "react"
import { Award, Heart, Users, Target } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "With 15 years in the toy industry, Sarah founded Cycles & Toys to bring quality and joy to families.",
  },
  {
    name: "Mike Chen",
    role: "Head of Operations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Mike ensures every product meets our high standards and manages our efficient delivery system.",
  },
  {
    name: "Emma Davis",
    role: "Customer Experience Manager",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Emma leads our customer service team and ensures every customer has an amazing experience.",
  },
]

const milestones = [
  { year: "2010", event: "Store Founded", description: "Started as a small local shop" },
  { year: "2015", event: "Online Expansion", description: "Launched our e-commerce platform" },
  { year: "2018", event: "10,000+ Happy Customers", description: "Reached major customer milestone" },
  { year: "2020", event: "Eco-Friendly Initiative", description: "Introduced sustainable product lines" },
  { year: "2023", event: "Award Winner", description: "Best Local Toy Store Award" },
]

type SectionId = "brand-story" | "mission-vision" | "values" | "timeline" | "team" | "store-photos";
type IsVisibleState = Partial<Record<SectionId, boolean>>;

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState<IsVisibleState>({})

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
      <section className="relative h-96 overflow-hidden">
        <Image src="./assets/aboutus.jpg" alt="About Us Hero" fill className="object-fit bg-bottom" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/70 to-[#000000c7]" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up mobile-text-3xl">
              About Cycles & Toys
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl animate-fade-in-up animation-delay-300 mobile-text-lg">
              Creating magical moments for families since 2010
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section
        id="brand-story"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["brand-story"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
                Our Story
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed mobile-text-base">
                What started as a small dream in 2010 has grown into a beloved destination for families seeking quality
                cycles and educational toys. Our founder, Sarah Johnson, noticed a gap in the market for stores that
                truly understood what children and parents needed.
              </p>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed mobile-text-base">
                We believe that play is not just fun—it's fundamental to a child's development. Every product we select
                is chosen with care, ensuring it meets our high standards for safety, quality, and educational value.
              </p>
            
            </div>
            <div className="relative ">
              <Image
                src="./Logomain.png"
                alt="Our Story"
                width={400}
                height={500}
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-500 bg-gray-900"
              />
              <div className="absolute bottom-0 right-16 w-32 h-32 bg-gradient-to-br from-yellow-500/90 to-[#ffffff48] rounded-full opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        id="mission-vision"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["mission-vision"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Mission & Vision
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-lg">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm">
                  To provide families with high-quality cycles and educational toys that inspire creativity, promote
                  physical activity, and create lasting memories. We strive to be the trusted partner in every child's
                  journey of growth and discovery.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 text-pink-600 mx-auto mb-6" />
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-lg">
                  Our Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mobile-text-sm">
                  To be the leading destination for families seeking quality cycles and toys, known for our exceptional
                  customer service, carefully curated products, and commitment to child development and family
                  happiness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        id="values"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["values"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
              <CardContent className="p-8">
                <Award className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-base">
                  Quality First
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                  We never compromise on quality, ensuring every product meets the highest safety and durability
                  standards.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
              <CardContent className="p-8">
                <Users className="w-16 h-16 text-green-600 mx-auto mb-6" />
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-base">
                  Family Focus
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                  Everything we do is centered around bringing families together and creating joyful experiences.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center">
              <CardContent className="p-8">
                <Heart className="w-16 h-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-base">
                  Customer Care
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">
                  Our customers are family, and we treat every interaction with care, respect, and genuine concern.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        id="timeline"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["timeline"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400" />
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                  <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="text-xl md:text-2xl font-bold text-purple-600 mb-2 mobile-text-lg">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 mobile-text-base">
                        {milestone.event}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mobile-text-sm">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white dark:border-gray-800 shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section
        id="team"
        data-animate
        className={`py-20 px-4 transition-all duration-1000 ${
          isVisible["team"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className={`border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 text-center overflow-hidden ${
                  isVisible["team"]
                    ? `opacity-100 transform translate-y-0 transition-delay-[${index * 200}ms]`
                    : "opacity-0 transform translate-y-8"
                }`}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 mobile-text-base">
                      {member.name}
                    </h3>
                    <p className="text-purple-600 font-semibold mb-3 mobile-text-sm">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mobile-text-sm">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Store Photos */}
      <section
        id="store-photos"
        data-animate
        className={`py-20 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${
          isVisible["store-photos"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mobile-text-2xl">
            Our Beautiful Store
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg group cursor-pointer ${
                  isVisible["store-photos"]
                    ? `opacity-100 transform scale-100 transition-delay-[${index * 100}ms]`
                    : "opacity-0 transform scale-95"
                } transition-all duration-500`}
              >
                <Image
                  src={`/placeholder.svg?height=300&width=400`}
                  alt={`Store photo ${index}`}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
