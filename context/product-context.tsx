"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Product {
    M01_id: string
    M01_name: string
    M01_image_url: string
    M01_price_basic: number
    M01_price_premium: number
    M01_category_code: string
    M01_brand_code: string
    M01_is_visible: boolean
    M01_color_codes: string[] // This should be string[] based strictly on your JSON
    M01_description: string // Add other properties as needed
}

interface ProductContextType {
    products: Product[]
    isLoading: boolean
    error: string | null
    refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/productLists/0`)
            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }
            const data = await response.json()
            if (data.success && data.data) {
                setProducts(data.data)
            } else {
                setProducts([])
            }
        } catch (err: any) {
            console.error("Error fetching products:", err)
            setError(err.message || "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    return (
        <ProductContext.Provider
            value={{
                products,
                isLoading,
                error,
                refreshProducts: fetchProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}

export function useProductContext() {
    const context = useContext(ProductContext)
    if (context === undefined) {
        throw new Error("useProductContext must be used within a ProductProvider")
    }
    return context
}
