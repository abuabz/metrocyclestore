import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ToastProvider from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Metrotoys - Cycles & Toys for Every Age",
  description: "Explore Metro Toy Store for premium cycles, educational toys, and fun essentials for kids of all ages.",
  applicationName: "Metro Toy Store",
  authors: [{ name: "Metro Toy Store Team", url: "https://metrotoystore.com" }],
  keywords: ["toys", "kids cycles", "educational toys", "Metro Toy Store", "baby toys", "ride-ons"],
  themeColor: "#ffffff",
  colorScheme: "light dark",
  creator: "Metro Toy Store",
  publisher: "Metro Toy Store",
  metadataBase: new URL("https://metrotoystore.com"),
  icons: {
    icon: "./Logomain.png", // or "/favicon.png" or "/favicon.svg"
    shortcut: "./Logomain.png",
    apple: "./Logomain.png", // if available
  },
  openGraph: {
    title: "Metro Toy Store - Adventure Awaits!",
    description: "Discover our wide collection of cycles and toys for children of all ages.",
    url: "https://metrotoystore.com",
    siteName: "Metro Toy Store",
    images: [
      {
        url: "./Logomain.png", // replace with actual image path
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
    images: ["./Logomain.png"], // replace with actual image path
  },

  alternates: {
    canonical: "https://metrotoystore.com",
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
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
