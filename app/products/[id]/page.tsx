"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw, Award, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import LightHeader from "@/components/light-header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
// @ts-ignore
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
  const { showToast } = useToast()

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
      showToast(`${product.name} removed from cart!`, "info")
    } else {
      // Ensure all variations are selected before adding to cart
      const missingVariations = variations.filter(
        (variation) => !selectedVariations[variation._id]
      )
      if (missingVariations.length > 0) {
        showToast(`Please select a ${missingVariations[0].M08_name} option.`, "error")
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
      showToast(`${product.name} added to cart!`, "success")
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
      showToast(`Please select a ${missingVariations[0].M08_name} option.`, "error");
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
      <div className="min-h-screen bg-white">
        <LightHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
              Loading Product Details...
            </h1>
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <LightHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">
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
    <div className="min-h-screen bg-white text-slate-900">
      <LightHeader />

      {/* Breadcrumb */}
      <section className="pt-32 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <Link href="/products" className="hover:text-black transition-colors">
              Products
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{product.name}</span>
          </nav>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-8 group">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                {product.badge && (
                  <Badge className={`absolute top-6 left-6 px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${getBadgeColor(product.badge)} text-white border-0 shadow-lg`}>
                    {product.badge}
                  </Badge>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${selectedImage === index
                      ? "border-yellow-500 ring-2 ring-yellow-500/20"
                      : "border-slate-100 hover:border-slate-300 bg-slate-50"
                      }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                    {product.category}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                    <span className="ml-2 text-xs font-medium text-slate-400">({product.reviews} reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-3xl font-bold text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-slate-400 line-through font-medium">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="text-sm font-bold text-green-600 px-2 py-0.5 bg-green-50 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="h-px bg-slate-100 mb-8" />

              {/* Variations */}
              {variations.length > 0 && (
                <div className="space-y-8 mb-8">
                  {variations.map((variation) => (
                    <div key={variation._id} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                          Select {variation.M08_name}
                        </span>
                        {selectedVariations[variation._id] && (
                          <span className="text-xs font-medium text-slate-500">
                            {variation.options.find(o => o._id === selectedVariations[variation._id])?.M09_name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {variation.options.map((option) => {
                          const isDisabled = !availableOptions[variation._id]?.has(option._id)
                          const isSelected = selectedVariations[variation._id] === option._id
                          return (
                            <button
                              key={option._id}
                              onClick={() => !isDisabled && handleVariationChange(variation._id, option._id)}
                              disabled={isDisabled}
                              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border-2 ${isSelected
                                ? "border-slate-900 bg-slate-900 text-white shadow-md scale-[1.02]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                                } ${isDisabled ? "opacity-30 cursor-not-allowed grayscale" : ""}`}
                            >
                              {option.M09_name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stock and Features Preview */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  {product.inStock ? (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-bold bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      In Stock & Ready to Ship
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-bold bg-red-50 px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      Currently Out of Stock
                    </div>
                  )}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                  {product?.description}
                </p>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-6 mt-auto">
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center bg-slate-50 rounded-2xl p-1 border border-slate-200">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-600"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm text-slate-600"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    size="lg"
                    className={`h-14 text-base font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${!product.inStock
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                      }`}
                  >
                    Buy Now
                  </Button>
                  <Button
                    onClick={handleCartAction}
                    disabled={!product.inStock}
                    variant="outline"
                    size="lg"
                    className={`h-14 text-base font-bold rounded-2xl border-2 transition-all duration-300 active:scale-95 ${!product.inStock
                      ? "border-slate-100 text-gray-200"
                      : isInCart
                        ? "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        : "border-slate-900 text-slate-200 hover:bg-slate-900 hover:text-white"
                      }`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isInCart ? "Remove" : "Add to Cart"}
                  </Button>
                </div>

                {/* Benefits */}

              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="product-tabs"
        data-animate
        className={`py-20 px-4 bg-slate-50 border-y border-slate-100 transition-all duration-1000 ${isVisible["product-tabs"] ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
          }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center space-x-12 border-b border-slate-200 mb-12">
            {["features", "specifications"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-4 text-sm font-bold uppercase tracking-widest transition-all duration-300 relative ${activeTab === tab
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === "features" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md">
                      <div className="h-8 w-8 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-yellow-600" />
                      </div>
                      <span className="text-slate-600 text-sm font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">No detailed features specified for this product.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-4 border-b border-slate-100 px-2 transition-colors hover:bg-slate-50/50">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                      <span className="text-sm font-bold text-slate-900">{value}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">Specifications haven't been listed yet.</p>
                  </div>
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