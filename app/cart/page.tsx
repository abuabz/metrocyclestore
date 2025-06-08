"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const handlePromoCode = () => {
    // Simple promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1) // 10% discount
    } else if (promoCode.toLowerCase() === "welcome") {
      setDiscount(0.05) // 5% discount
    } else {
      setDiscount(0)
      alert("Invalid promo code")
    }
  }

  const subtotal = getCartTotal()
  const discountAmount = subtotal * discount
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal - discountAmount + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <Header />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 mobile-text-xl">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8 mobile-text-base">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-white hover:from-white hover:to-yellow-500 text-black px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300 mobile-text-base"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 mobile-text-xl">
              Shopping Cart
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mobile-text-sm">{getCartCount()} items in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="w-20 h-20 object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1 mobile-text-sm">
                          {item.name}
                        </h3>
                        <p className="text-yellow-500 font-bold text-lg md:text-xl mobile-text-base">${item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-3 py-2"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-4 py-2 font-medium text-gray-800 dark:text-gray-200">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-200 mobile-text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Continue Shopping */}
              <div className="pt-4">
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 mobile-text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 mobile-text-base">
                    Order Summary
                  </h2>

                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 mobile-text-sm">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                      <Button
                        onClick={handlePromoCode}
                        variant="outline"
                        className="border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 mobile-text-sm"
                      >
                        Apply
                      </Button>
                    </div>
                    {discount > 0 && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-2 mobile-text-sm">
                        ✓ {discount * 100}% discount applied!
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">Subtotal:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 mobile-text-sm">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span className="mobile-text-sm">Discount ({discount * 100}%):</span>
                        <span className="mobile-text-sm">-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 mobile-text-sm">Shipping:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 mobile-text-sm">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {subtotal < 50 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mobile-text-sm">
                        Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}

                    <hr className="border-gray-200 dark:border-gray-700" />

                    <div className="flex justify-between text-base md:text-lg font-bold">
                      <span className="text-gray-800 dark:text-gray-200 mobile-text-base">Total:</span>
                      <span className="text-yellow-500 mobile-text-base">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-500 to-white hover:from-yellow-600 hover:to-white text-black py-4 text-base md:text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 mobile-text-base"
                  >
                    Proceed to Checkout
                  </Button>

                  {/* Security Info */}
{/*                   <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mobile-text-sm">
                      🔒 Secure checkout with SSL encryption
                    </p>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
