import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rincón Dulce Pasto | Waffles, Bowls de Fresas & Helados",
  description:
    "Postres irresistibles en Pasto, Nariño: Waffles artesanales, bowls de fresas frescas con helado o crema, helado soft y toppings. ¡Pide tu domicilio directo a WhatsApp!",
  keywords: [
    "Rincon Dulce Pasto",
    "Waffles Pasto",
    "Fresas con crema Pasto",
    "Helados Pasto Nariño",
    "Postres a domicilio Pasto",
    "Helado soft Pasto",
  ],
  authors: [{ name: "Rincón Dulce" }],
  creator: "Rincón Dulce",
  openGraph: {
    title: "Rincón Dulce Pasto | Donde cada antojo sabe mejor",
    description:
      "Waffles, bowls de fresas, helado soft y heladísimos en Pasto, Nariño. Pide tu domicilio fácil por WhatsApp.",
    url: "https://rincondulcepasto.com",
    siteName: "Rincón Dulce Pasto",
    locale: "es_CO",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "Rincón Dulce Pasto - Waffles y Helados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rincón Dulce Pasto | Waffles, Bowls & Helados",
    description: "Postres artesanales y domicilios en Pasto, Nariño.",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${bebasNeue.variable} ${playfair.variable} scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col font-sans bg-[#FFF7EE] text-[#2B120E] antialiased selection:bg-[#7A1E1E] selection:text-white"
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
