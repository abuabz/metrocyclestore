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
  title: "Metrotoys - Cycles & Toys for Every Age",
  description: "Explore Metro Toy Store for premium cycles, educational toys, and fun essentials for kids of all ages.",
  applicationName: "Metro Toy Store",
  authors: [{ name: "Metro Toy Store Team", url: "https://metrotoystore.com" }],
  keywords: ["toys", "kids cycles", "educational toys", "Metro Toy Store", "baby toys", "ride-ons", "padikkal", "malappuram"],
  creator: "Metro Toy Store",
  publisher: "Metro Toy Store",
  metadataBase: new URL("https://metrotoystore.com"),
  icons: {
    icon: "./LogomainFav.png", // or "/favicon.png" or "/favicon.svg"
    shortcut: "./LogomainFav.png",
    apple: "./LogomainFav.png", // if available
  },
  openGraph: {
    title: "Metro Toy Store - Adventure Awaits!",
    description: "Discover our wide collection of cycles and toys for children of all ages.",
    url: "https://metrotoystore.com",
    siteName: "Metro Toy Store",
    images: [
      {
        url: "https://metrotoystore.com/Logomainblack.jpg", // replace with actual image path
        width: 1200,
        height: 630,
        alt: "Metro Toy Store",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "Metro Toy Store - Adventure Awaits!",
    description: "Cycles and educational toys crafted for children's growth and fun.",
    site: "@metrotoystore", // if you have a Twitter handle
    images: ["https://metrotoystore.com/Logomainblack.jpg"], // replace with actual image path
  },

  alternates: {
    canonical: "https://metrotoystore.com",
  },
  other: {
    "google-site-verification": "Hen8ccx2qHN1vNizAcnk-OR8ukf_h7trnTBR0_fQ5pI"
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
      </body>
    </html>
  )
}
