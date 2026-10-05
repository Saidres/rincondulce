"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { MessageCircle, ShoppingBag } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export default function FloatingWhatsApp({ whatsappNumber }: FloatingWhatsAppProps) {
  const { totalCount, setIsCartOpen } = useCart();
  const cleanPhone = whatsappNumber.replace(/\D/g, "");

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Floating Cart Pill (if items > 0) */}
      {totalCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#7A1E1E] hover:bg-[#5C1515] text-[#FFF7EE] font-bold text-xs uppercase tracking-wider rounded-full shadow-2xl border-2 border-white animate-bounce active:scale-95 transition-all"
        >
          <ShoppingBag size={16} />
          <span>Ver Carrito</span>
          <span className="bg-[#E12239] text-white px-2 py-0.5 rounded-full text-[11px] font-black">
            {totalCount}
          </span>
        </button>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
          "¡Hola Rincón Dulce! 👋 Vi su menú web y quiero hacer un pedido:"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-full shadow-2xl active:scale-90 transition-all hover:scale-105"
        aria-label="Contactar a Rincón Dulce por WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 group-hover:opacity-40"></span>
        <MessageCircle size={30} className="fill-white relative z-10" />

        {/* Tooltip on hover */}
        <span className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 bg-[#2B120E] text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          ¡Pide tu domicilio aquí! 🧇
        </span>
      </a>
    </div>
  );
}
