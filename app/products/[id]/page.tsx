"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import debounce from "lodash/debounce"

// Define interface for API response (Product Details)
interface ProductImage {
  _id: string
  M07_image_path: string
  M07_M06_product_sku_id: string
  M07_order: number
  M07_is_active: number
}

interface ProductSpec {
  key: string
  value: string
}

interface ProductVariation {
  _id: string
  M10_M06_product_sku_id: string
  M10_M08_product_variation_id: string
  M10_M09_variation_option_id: string
  M08_name: string
  M08_M05_product_id: string
  M08_is_active: number
  M09_name: string
  M09_M05_product_id: string
  M09_M08_product_variation_id: string
  M09_is_active: number
}

interface ProductApiResponse {
  success: boolean
  msg: string
  data: {
    _id: string
    M06_sku: string
    M06_product_sku_name: string
    M06_description: string
    M06_features: string[]
    M06_specs: ProductSpec[]
    M06_thumbnail_image: string
    M06_MRP: number
    M06_price: number
    M06_quantity: number
    M06_is_new: boolean
    M06_single_order_limit: number | null
    M06_is_active: number
    M06_is_out_of_stock: boolean
    M06_M05_product_id: string
    Images: ProductImage[]
    Variations: ProductVariation[]
  }
  statusCode: number
}

// Define interface for product to render
interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  category: string
  images: string[]
  rating: number
  reviews: number
  badge: string
  description: string
  features: string[]
  specifications: { [key: string]: string }
  inStock: boolean
  stockCount: number
  variations: ProductVariation[]
  productId: string // M06_M05_product_id
}

// Define interface for Variation API response
interface VariationOption {
  _id: string
  M09_name: string
  M09_is_active: number
}

interface Variation {
  _id: string
  M08_name: string
  M08_is_active: number
  options: VariationOption[]
}

interface VariationApiResponse {
  success: boolean
  msg: string
  data: Variation[]
  statusCode: number
}

// Define interface for SKU Variation API response
interface SkuVariationOption {
  _id: string
  name: string
}

interface SkuVariationDetail {
  _id: string
  name: string
  options: SkuVariationOption
}

interface SkuVariation {
  _id: string
  skuId: string
  M06_sku: string
  M06_product_sku_name: string
  M06_thumbnail_image: string
  variations: SkuVariationDetail[]
}

interface SkuVariationApiResponse {
  success: boolean
  msg: string
  data: SkuVariation[]
  statusCode: number
}

interface AvailableCombination {
  skuId: string
  variations: Record<string, string> // variationId: optionId
}

// Helper function to determine available options
const getAvailableOptions = (skuVariations: SkuVariation[]) => {
  const availableOptions: Record<string, Set<string>> = {} // variationId: Set of optionIds

  skuVariations.forEach((sku) => {
    sku.variations.forEach((variation) => {
      const variationId = variation._id
      const optionId = variation.options._id

      if (!availableOptions[variationId]) {
        availableOptions[variationId] = new Set()
      }
      availableOptions[variationId].add(optionId)
    })
  })

  return availableOptions
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const router = useRouter()
  const { addToCart, updateQuantity, removeFromCart, items } = useCart()
  const { toast } = useToast()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1) // Initialize quantity to 1
  const [activeTab, setActiveTab] = useState("features")
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({ "product-tabs": true })
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [variations, setVariations] = useState<Variation[]>([])
  const [skuVariations, setSkuVariations] = useState<SkuVariation[]>([])
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({})
  const [availableCombinations, setAvailableCombinations] = useState<AvailableCombination[]>([])
  const [availableOptions, setAvailableOptions] = useState<Record<string, Set<string>>>({})

  // Debounced function to update cart quantity
  const debouncedUpdateCartQuantity = useCallback(
    debounce((id: string, variations: { name: string; value: string }[], newQuantity: number) => {
      updateQuantity(id, variations, newQuantity)
    }, 1000),
    [updateQuantity]
  )

  // Fetch product data
  const fetchProductData = async (skuId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/product-sku/${skuId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      const data: ProductApiResponse = await response.json()
      if (data.success) {
        const apiProduct = data.data
        const mappedProduct: Product = {
          id: apiProduct._id,
          name: apiProduct.M06_product_sku_name,
          price: apiProduct.M06_price,
          originalPrice: apiProduct.M06_MRP,
          category: "Cycles",
          images: apiProduct.Images.map((img) => img.M07_image_path),
          rating: 5,
          reviews: 24,
          badge: apiProduct.M06_is_new ? "New" : "Best Seller",
          description: apiProduct.M06_description,
          features: apiProduct.M06_features,
          specifications: apiProduct.M06_specs.reduce((acc: { [key: string]: string }, spec: ProductSpec) => {
            acc[spec.key] = spec.value
            return acc
          }, {}),
          inStock: !apiProduct.M06_is_out_of_stock,
          stockCount: apiProduct.M06_quantity,
          variations: apiProduct.Variations,
          productId: apiProduct.M06_M05_product_id,
        }
        return mappedProduct
      } else {
        throw new Error(data.msg || 'API returned unsuccessful response')
      }
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    const initializeProductData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch initial product data
        const productData = await fetchProductData(productId)
        if (!productData) return
        setProduct(productData)

        // Fetch variations
        const variationResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/variation-by-product-id/${productData.productId}`
        )
        if (!variationResponse.ok) {
          throw new Error('Failed to fetch variations')
        }
        const variationData: VariationApiResponse = await variationResponse.json()
        if (variationData.success) {
          setVariations(variationData.data)
        } else {
          throw new Error(variationData.msg || 'Failed to fetch variations')
        }

        // Fetch SKU variations and create available combinations
        const skuVariationResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/customer/skus-variation-by-product-id/${productData.productId}`
        )
        if (!skuVariationResponse.ok) {
          throw new Error('Failed to fetch SKU variations')
        }
        const skuVariationData: SkuVariationApiResponse = await skuVariationResponse.json()
        if (skuVariationData.success) {
          setSkuVariations(skuVariationData.data)

          // Set available options
          const availableOpts = getAvailableOptions(skuVariationData.data)
          setAvailableOptions(availableOpts)

          // Create available combinations map
          const combinations = skuVariationData.data.map((sku: SkuVariation) => {
            const variationMap: Record<string, string> = {}
            sku.variations.forEach((v: SkuVariationDetail) => {
              const variation = variationData.data.find((varItem: Variation) => varItem.M08_name === v.name)
              if (variation) {
                const option = variation.options.find((opt: VariationOption) => opt.M09_name === v.options.name)
                if (option) {
                  variationMap[variation._id] = option._id
                }
              }
            })
            return { skuId: sku._id, variations: variationMap }
          })
          setAvailableCombinations(combinations)

          // Set initial selected variations from current product SKU
          const currentSku = skuVariationData.data.find((sku: SkuVariation) => sku._id === productId)
          if (currentSku) {
            const initialSelections: Record<string, string> = {}
            currentSku.variations.forEach((v: SkuVariationDetail) => {
              const variation = variationData.data.find((varItem: Variation) => varItem.M08_name === v.name)
              if (variation) {
                const option = variation.options.find((opt: VariationOption) => opt.M09_name === v.options.name)
                if (option) {
                  initialSelections[variation._id] = option._id
                }
              }
            })
            setSelectedVariations(initialSelections)
          }
        } else {
          throw new Error(skuVariationData.msg || 'Failed to fetch SKU variations')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      initializeProductData()
    }
  }, [productId])

  // Update quantity based on selected variations
  useEffect(() => {
    if (!product || Object.keys(selectedVariations).length === 0) return

    // Map selected variations to the format used in the cart
    const variationDetails = variations.map((variation) => ({
      name: variation.M08_name,
      value:
        variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
    }))

    // Check if the current variation is in the cart
    const existingItem = items.find(
      (item) =>
        item.id === product.id &&
        JSON.stringify(item.variations) === JSON.stringify(variationDetails)
    )

    // If the variation is in the cart, set the quantity to the cart's quantity; otherwise, reset to 1
    setQuantity(existingItem ? existingItem.quantity : 1)
  }, [selectedVariations, items, product, variations])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll("[data-animate]")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleVariationChange = async (variationId: string, optionId: string) => {
    const newSelections = {
      ...selectedVariations,
      [variationId]: optionId,
    }

    // Check if the new selection matches an available combination
    let matchingCombination = availableCombinations.find((combo) =>
      Object.entries(newSelections).every(([vId, optId]) => combo.variations[vId] === optId)
    )

    if (matchingCombination) {
      // If exact match found, fetch and update full product data
      const newProductData = await fetchProductData(matchingCombination.skuId)
      if (newProductData && newProductData.id !== product?.id) {
        setProduct(newProductData)
      }
      setSelectedVariations(newSelections)
    } else {
      // If no exact match, find the first available combination with the selected option
      const partialMatch = availableCombinations.find((combo) => combo.variations[variationId] === optionId)
      if (partialMatch) {
        setSelectedVariations(partialMatch.variations)
        const newProductData = await fetchProductData(partialMatch.skuId)
        if (newProductData) {
          setProduct(newProductData)
        }
      } else {
        // If no combination includes the selected option, keep the selection but don't change product
        setSelectedVariations(newSelections)
      }
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)

    if (!product) return

    // Map selected variations to the format used in the cart
    const variationDetails = variations.map((variation) => ({
      name: variation.M08_name,
      value:
        variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
    }))

    // Update the cart quantity after a 1-second delay
    debouncedUpdateCartQuantity(product.id, variationDetails, newQuantity)
  }

  const isInCart = items.some(
    (item) =>
      item.id === product?.id &&
      JSON.stringify(item.variations) ===
      JSON.stringify(
        variations.map((variation) => ({
          name: variation.M08_name,
          value:
            variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
        }))
      )
  )

  const handleCartAction = () => {
    if (!product) return

    if (isInCart) {
      removeFromCart(product.id, variations.map((variation) => ({
        name: variation.M08_name,
        value:
          variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
      })))
      toast({
        description: `${product.name} removed from cart!`,
        variant: "info",
      })
    } else {
      // Ensure all variations are selected before adding to cart
      const missingVariations = variations.filter(
        (variation) => !selectedVariations[variation._id]
      )
      if (missingVariations.length > 0) {
        toast({
          description: `Please select a ${missingVariations[0].M08_name} option.`,
          variant: "destructive",
        })
        return
      }

      // Map selected variations to the format expected by the cart
      const variationDetails = variations.map((variation) => ({
        name: variation.M08_name,
        value:
          variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
      }))

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity, // Use the current quantity
        variations: variationDetails, // Add selected variations to cart item
      })
      toast({
        description: `${product.name} added to cart!`,
        variant: "success",
      })
    }
  }

 const handleBuyNow = () => {
  if (!product) return;

  // Map selected variations to the format used in the cart
  const variationDetails = variations.map((variation) => ({
    name: variation.M08_name,
    value:
      variation.options.find((opt) => opt._id === selectedVariations[variation._id])?.M09_name || "",
  }));

  if (!product.inStock) {
    // If product is out of stock, do nothing (button will be disabled)
    return;
  }

  // Check if all variations are selected
  const missingVariations = variations.filter(
    (variation) => !selectedVariations[variation._id]
  );
  if (missingVariations.length > 0) {
    toast({
      description: `Please select a ${missingVariations[0].M08_name} option.`,
      variant: "destructive",
    });
    return;
  }

  // Check if product is already in cart
  const isCurrentlyInCart = items.some(
    (item) =>
      item.id === product.id &&
      JSON.stringify(item.variations) === JSON.stringify(variationDetails)
  );

  if (!isCurrentlyInCart) {
    // If product is not in cart, add it
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
      variations: variationDetails,
    });
  }

  // Navigate to cart regardless of whether it was just added or already in cart
  router.push("/cart");
};
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Best Seller":
        return "bg-green-500"
      case "New":
        return "bg-blue-500"
      case "Popular":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
              Loading...
            </h1>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
              {error || "Product Not Found"}
            </h1>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-yellow-500 to-white text-black">Back to Products</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      {/* Breadcrumb */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600 dark:text-gray-400 mobile-text-sm">
            <Link href="/" className="hover:text-yellow-500 dark:hover:text-yellow-500">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-yellow-500 dark:hover:text-yellow-500">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-yellow-600 dark:text-yellow-500">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4 flex flex-col justify-center items-center">
              <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg w-[400px]">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={600}
                  className="h-96 object-contain"
                />
                {product.badge && (
                  <Badge className={`absolute top-4 left-4 ${getBadgeColor(product.badge)} text-white border-0`}>
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${selectedImage === index
                      ? "border-yellow-500 scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:border-yellow-300"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 mobile-text-xl">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge
                    variant="outline"
                    className="text-yellow-600 dark:text-yellow-400 border-yellow-600 dark:border-yellow-400"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl md:text-3xl font-bold text-yellow-500 mobile-text-xl">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400 line-through mobile-text-base">
                    ₹{product.originalPrice}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge className="bg-red-500 text-white">Save ₹{product.originalPrice - product.price}</Badge>
                )}
              </div>

              {/* Variations */}
              {variations.length > 0 && (
                <div className="space-y-4">
                  {variations.map((variation) => (
                    <div key={variation._id}>
                      <span className="font-medium text-gray-700 dark:text-gray-300 mobile-text-sm">
                        {variation.M08_name}:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {variation.options.map((option) => {
                          const isDisabled = !availableOptions[variation._id]?.has(option._id)
                          return (
                            <Button
                              key={option._id}
                              variant={
                                selectedVariations[variation._id] === option._id ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleVariationChange(variation._id, option._id)}
                              disabled={isDisabled}
                              className={`mobile-text-sm ${selectedVariations[variation._id] === option._id
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {option.M09_name}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium mobile-text-sm">
                      In Stock
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 dark:text-red-400 font-medium mobile-text-sm">Out of Stock</span>
                  </>
                )}
              </div>

              <p className="pe-5 text-gray-200 line-clamp-5 hover:line-clamp-none transition-all duration-300 mobile-text-sm">
                {product?.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-700 dark:text-gray-300 mobile-text-sm">Quantity:</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                    className="px-3 py-2"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)} // No upper limit check
                    className="px-3 py-2"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex justify-center gap-3 md:gap-5 flex-col md:flex-row">
                <Button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  size="lg"
                  className={`w-full py-4 text-base md:text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 mobile-text-base ${!product.inStock
                      ? "bg-red-100 text-red-600 hover:bg-red-100 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-500 to-white hover:from-yellow-600 hover:to-gray-300 text-black"
                    }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
                <Button
                  onClick={handleCartAction}
                  disabled={!product.inStock}
                  size="lg"
                  className={`w-full py-4 text-base md:text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 mobile-text-base ${!product.inStock
                    ? "bg-red-100 text-red-600 hover:bg-red-100 cursor-not-allowed"
                    : isInCart
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                    }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {!product.inStock
                    ? "Out of Stock"
                    : isInCart
                      ? "Remove from Cart"
                      : `Add to Cart - ₹${(product.price * quantity).toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section
        id="product-tabs"
        data-animate
        className={`py-12 px-4 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 ${isVisible["product-tabs"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-8">
            {["features", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium capitalize transition-all duration-300 mobile-text-sm ${activeTab === tab
                  ? "text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 mobile-text-sm">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No features available.</p>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-medium text-gray-800 dark:text-gray-200 mobile-text-sm">{key}:</span>
                      <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">No specifications available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}