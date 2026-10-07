import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ToastProvider from "@/components/toast-provider"
import { ProductProvider } from "@/context/product-context"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  title: "Metro Cycles & Toys | Premium Cycles & Battery Operated Vehicles in Kerala",
  description: "Your ultimate destination for premium cycles, battery-operated vehicles, and educational toys in Padikkal, Kerala. We offer expert services, repair, and a huge collection for all ages.",
  applicationName: "Metro Cycles & Toys",
  authors: [{ name: "Metro Cycles Team", url: "https://metrotoystore.com" }],
  keywords: [
    "battery operated vehicle in kerala", 
    "cycles in kerala", 
    "kids cycles padikkal", 
    "electric toy cars kerala",
    "premium bicycles kerala",
    "cycle repair padikkal",
    "Metro Toy Store", 
    "educational toys kerala",
    "malappuram cycle store",
    "padikkal toys"
  ],
  creator: "Metro Cycles & Toys",
  publisher: "Metro Cycles & Toys",
  metadataBase: new URL("https://metrotoystore.com"),
  icons: {
    icon: "./LogomainFav.png",
    shortcut: "./LogomainFav.png",
    apple: "./LogomainFav.png",
  },
  openGraph: {
    title: "Metro Cycles & Toys | Battery Operated Vehicles & Cycles in Kerala",
    description: "Discover our wide collection of premium cycles and battery-operated vehicles for children of all ages. Located in Padikkal, Kerala.",
    url: "https://metrotoystore.com",
    siteName: "Metro Cycles & Toys",
    images: [
      {
        url: "https://metrotoystore.com/Logomainblack.jpg",
        width: 1200,
        height: 630,
        alt: "Metro Cycles & Toys Store in Padikkal, Kerala",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Metro Cycles & Toys | Padikkal, Kerala",
    description: "Premium cycles, battery-operated vehicles, and toys in Padikkal, Kerala.",
    site: "@metrotoystore",
    images: ["https://metrotoystore.com/Logomainblack.jpg"],
  },
  alternates: {
    canonical: "https://metrotoystore.com",
  },
  other: {
    "google-site-verification": "Hen8ccx2qHN1vNizAcnk-OR8ukf_h7trnTBR0_fQ5pI"
  },
}

import Providers from "./providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ProductProvider>
              {children}
              <ToastProvider />
            </ProductProvider>
          </ThemeProvider>
        </Providers>
        
        {/* Local Business SEO Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "Metro Cycles & Toys",
              "image": "https://metrotoystore.com/Logomainblack.jpg",
              "description": "Your ultimate destination for premium cycles, battery-operated vehicles, and educational toys in Padikkal, Kerala.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Padikkal",
                "addressRegion": "Kerala",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "11.1154", // Estimated for Padikkal/Malappuram area
                "longitude": "75.8752"
              },
              "url": "https://metrotoystore.com",
              "telephone": "+918714722927",
              "priceRange": "₹₹",
              "sameAs": [
                "https://www.instagram.com/metro_toys_padikkal/"
              ]
            })
          }}
        />
      </body>
    </html>
  )
}
