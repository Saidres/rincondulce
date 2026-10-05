"use client";

import React from "react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Clock, MessageCircle, MapPin } from "lucide-react";

interface HeaderProps {
  isOpenNow?: boolean;
  scheduleText?: string;
  whatsappNumber?: string;
}

export default function Header({
  isOpenNow = true,
  scheduleText = "Martes a Domingo: 2:00 PM - 9:00 PM",
  whatsappNumber = "573180000000",
}: HeaderProps) {
  const { totalCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#FFF7EE]/95 backdrop-blur-md border-b border-[#7A1E1E]/10 transition-all">
      {/* Top micro-bar with schedule & location */}
      <div className="bg-[#7A1E1E] text-[#FFF7EE] px-4 py-1 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="truncate">
            {isOpenNow ? "¡Abierto hoy!" : "Cerrado por ahora"} • {scheduleText}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 opacity-90 shrink-0">
          <MapPin size={12} />
          <span>Pasto, Nariño</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <a href="#hero" className="hover:opacity-90 transition-opacity">
          <Logo size="sm" />
        </a>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Quick WhatsApp link */}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("¡Hola Rincón Dulce! Vi su página web y quiero hacer una consulta:")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7A1E1E] bg-[#FFF3DE] hover:bg-[#FFE8C2] border border-[#7A1E1E]/20 rounded-full transition-colors"
          >
            <MessageCircle size={14} className="text-[#25D366]" />
            <span>Chat WhatsApp</span>
          </a>

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 bg-[#7A1E1E] hover:bg-[#5C1515] active:scale-95 text-[#FFF7EE] rounded-full shadow-sm transition-all"
            aria-label="Abrir carrito de compras"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline font-bold text-xs uppercase tracking-wider">
              Mi Pedido
            </span>
            {totalCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-black text-white bg-[#E12239] border border-white rounded-full animate-bounce">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
