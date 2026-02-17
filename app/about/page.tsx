"use client";

import { useState, useEffect } from "react";
import { Award, Heart, Users, Target, Clock, MapPin, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/light-header";
import Footer from "@/components/footer";
import ScrollReveal from "@/components/ui/scroll-reveal";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  {
    name: "Abdul Azeez P",
    role: "Founder & CEO",
    image: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
    bio: "With 8 years in the toy industry, Abdul Azeez founded Cycles & Toys to bring quality and joy to families.",
  },
  {
    name: "Junaid Babu TK",
    role: "Manager",
    image: "/assets/manager.jpeg",
    bio: "Junaid oversees daily operations and ensures our products meet the highest standards of quality and safety.",
  },
  {
    name: "Shamnad KP",
    role: "Sales Executive",
    image: "/assets/sales.jpeg",
    bio: "Shamnad leads our customer service team and ensures every customer has an amazing experience.",
  },
];

const milestones = [
  { year: "2017", event: "Store Founded", description: "We began with a simple idea to bring joy to our community." },
  { year: "2019", event: "Expansion", description: "Expanded into a complete toy store with a wider range of products." },
  { year: "2022", event: "Online Launch", description: "Started our online journey to reach customers beyond our neighborhood." },
  { year: "2025", event: "30k+ Happy Customers", description: "Celebrating a milestone of serving over 30,000 happy families." },
];

const values = [
  {
    icon: <Award className="w-8 h-8" />,
    title: "Quality First",
    description: "We never compromise on quality, ensuring every product meets highest safety standards.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Family Focus",
    description: "Everything we do is centered around bringing families together and joyful experiences.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Customer Care",
    description: "Our customers are family, and we treat every interaction with care and respect.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-200">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 z-10">
              <ScrollReveal animation="fade-in-up">
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 mb-6 px-4 py-1 text-sm">
                  Since 2010
                </Badge>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                  Creating <span className="text-yellow-500">Magical</span> Moments
                </h1>
                <p className="text-xl text-gray-500 mb-8 max-w-lg leading-relaxed">
                  We're more than just a store. We're a destination for families seeking quality adventures and educational play.
                </p>
                <div className="flex gap-4">
                  <Link href="/contact">
                    <Button className="bg-black hover:bg-yellow-500 text-white hover:text-black font-bold px-8 py-6 rounded-full text-lg transition-transform hover:scale-105 shadow-lg">
                      Visit Us <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            <div className="w-full md:w-1/2 relative">
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <Image
                    src="/assets/aboutus.jpg"
                    alt="About Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                {/* Floating Elements */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl animate-float hidden md:block">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Users className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">30K+</p>
                      <p className="text-xs text-gray-500">Happy Families</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <ScrollReveal animation="fade-in-up" delay={200}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      <Image src="/assets/shop.png" alt="Shop Interior" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-gray-100">
                      <h3 className="font-bold text-xl mb-2">Local Roots</h3>
                      <p className="text-sm text-gray-500">Proudly serving our community with dedication.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
                      <h3 className="font-bold text-xl mb-2 text-yellow-800">Global Standards</h3>
                      <p className="text-sm text-yellow-800/70">Curating the best products from around the world.</p>
                    </div>
                    <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      <Image src="/assets/shop_01.jpeg" alt="Shop Display" fill className="object-cover hover:scale-110 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="order-1 lg:order-2">
              <ScrollReveal animation="fade-in-up">
                <h2 className="text-yellow-500 font-bold uppercase tracking-widest text-sm mb-4">Our Story</h2>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">From a Dream to a Destination</h2>
                <p className="text-lg text-gray-500 mb-6 leading-relaxed">
                  What started as a small dream in 2010 has grown into a beloved destination for families. We noticed a gap in the market for stores that truly understood what children and parents needed - quality, safety, and a touch of magic.
                </p>
                <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                  We believe that play is fundamental to a child's development. Every product we select is chosen with care, ensuring it meets our high standards for educational value and fun.
                </p>

                <div className="flex flex-col gap-4">
                  {["PASSION FOR PLAY", "COMMUNITY FIRST", "EDUCATIONAL VALUE"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="font-semibold text-gray-800">{item}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal animation="fade-in-up" delay={0} className="h-full">
              <Card className="h-full border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center text-center h-full">
                  <div className="bg-red-50 p-4 rounded-full mb-6">
                    <Target className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    To provide families with high-quality cycles and educational toys that inspire creativity, promote physical activity, and create lasting memories.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade-in-up" delay={200} className="h-full">
              <Card className="h-full border-gray-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center text-center h-full">
                  <div className="bg-blue-50 p-4 rounded-full mb-6">
                    <Heart className="w-10 h-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-500 leading-relaxed text-lg">
                    To be the leading destination for families seeking quality play, known for exceptional service and a commitment to child development.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 mb-4 px-4 py-1 text-sm">Core Values</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Drives Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100} className="h-full">
                <Card className="h-full border-gray-100 bg-slate-50 hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl group">
                  <CardContent className="p-8">
                    <div className="bg-white p-3 rounded-2xl w-fit shadow-sm mb-6 text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">{value.title}</h3>
                    <p className="text-gray-500 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Our Journey</h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200" />
            {milestones.map((milestone, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100}>
                <div className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="text-2xl font-bold text-yellow-500 mb-2 font-mono">
                        {milestone.year}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {milestone.event}
                      </h3>
                      <p className="text-sm text-gray-500">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-yellow-500 rounded-full z-10" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-gray-500">The passionate people behind Metro Toys & Cycles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <ScrollReveal key={index} animation="fade-in-up" delay={index * 100}>
                <div className="group text-center">
                  <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6 shadow-md">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <div className="flex gap-2">
                        {/* Social icons placeholder */}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-yellow-600 font-medium mb-3 text-sm">{member.role}</p>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Store Photos - Masonry Grid */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Our Store</h2>
              <p className="text-gray-500">A peek inside our world of joy.</p>
            </div>
            <Link href="/contact">
              <Button variant="outline" className="hidden md:flex rounded-full border-gray-300 hover:border-yellow-500 hover:text-yellow-600">
                Get Directions
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {[1, 2, 3, 4, 5, 6].map((index, idx) => (
              <ScrollReveal
                key={index}
                animation="fade-in-up"
                delay={idx * 50}
                className={`relative rounded-3xl overflow-hidden group shadow-sm ${idx % 3 === 0 ? 'md:col-span-2 md:row-span-2' : 'col-span-1 row-span-1'}`}
              >
                <Image
                  src={`/assets/shop_0${index}.jpeg`}
                  alt={`Store photo ${index}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}