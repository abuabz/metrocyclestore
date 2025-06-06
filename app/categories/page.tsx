"use client"
import Footer from '@/components/footer'
import Header from '@/components/header'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

interface ProductCategory {
    _id: string
    M04_category_name: string
    M04_image: string | null
    M04_M04_parent_category_id: string | null
    M04_is_active: number
    M04_deleted_at: string | null
    createdAt: string
    updatedAt: string
}

interface ApiResponse {
    success: boolean
    msg: string
    data: {
        productCategories: ProductCategory[]
        pagination: {
            currentPage: number
            totalPages: number
            totalItems: number
            limit: number
        }
    }
    statusCode: number
}

export default function Page() {
    const [categories, setCategories] = useState<ProductCategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-category?limit=30`)
                if (!response.ok) {
                    throw new Error('Failed to fetch product categories')
                }
                const data: ApiResponse = await response.json()
                if (data.success) {
                    // Filter child categories (where M04_M04_parent_category_id is not null)
                    const childCategories = data.data.productCategories.filter(
                        (category) => category.M04_M04_parent_category_id !== null
                    )
                    setCategories(childCategories)
                } else {
                    throw new Error(data.msg || 'API returned unsuccessful response')
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
            <Header />
            <section className="relative h-64 overflow-hidden">
                <Image src="/assets/ourproducts.jpg" alt="Products Hero" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-700/70 to-[#000000c7]" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                    <div className="max-w-4xl px-4">
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up mobile-text-2xl">
                            Our Categories
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl animate-fade-in-up animation-delay-300 mobile-text-base">
                            Discover our amazing collection of cycles, toys, and accessories
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center text-gray-600 dark:text-gray-300">Loading categories...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 text-center">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="relative h-48 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 bg-cover bg-center cursor-pointer"
                                style={{
                                    backgroundImage: `url(${category.M04_image || '/assets/placeholder.jpg'})`,
                                }}
                            >
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-[#ffffffc2] text-shadow-md capitalize text-wrap">
                                        {category.M04_category_name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}