import React from "react";
import Image from "next/image";
import Logo from "./Logo";
import { MessageCircle, ArrowDown, Sparkles, Bike, Heart } from "lucide-react";

interface HeroProps {
  heroTitle?: string;
  heroSubtitle?: string;
  whatsappNumber?: string;
}

export default function Hero({
  heroTitle = "Waffles, Bowls & Helados que Enamoran",
  heroSubtitle = "Postres artesanales, fresas frescas y helado suave preparado al instante en Pasto. Pide a domicilio por WhatsApp y recíbelo calientito en casa.",
  whatsappNumber = "573180000000",
}: HeroProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");
  const directOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "¡Hola Rincón Dulce! 👋 Quiero pedir a domicilio en Pasto:"
  )}`;

  return (
    <section id="hero" className="relative overflow-hidden bg-[#7A1E1E] text-[#FFF7EE] py-12 md:py-16">
      {/* Decorative repeating typography in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-col justify-around leading-none overflow-hidden font-display text-8xl md:text-9xl text-white whitespace-nowrap">
        <div>WAFFLE • BOWL • HELADO • TOPPINGS • WAFFLE</div>
        <div>DONDE CADA ANTOJO SABE MEJOR • RINCÓN DULCE</div>
        <div>FRESAS • CHOCOLATE • CREMA • SOFT • PASTO</div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF7EE]/15 border border-[#FFF7EE]/25 backdrop-blur-sm text-xs font-semibold text-[#FFF3DE]">
            <Sparkles size={14} className="text-amber-300" />
            <span>@rincondulcepasto • Domicilios en Pasto</span>
          </div>

          {/* Main Titles */}
          <div className="space-y-2">
            <p className="font-serif-bistro italic text-amber-200 text-lg md:text-xl">
              Donde cada antojo sabe mejor
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-wide leading-tight drop-shadow-md">
              {heroTitle}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#FFF3DE]/90 max-w-xl font-normal leading-relaxed">
            {heroSubtitle}
          </p>

          {/* Trust Highlights */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-md pt-2">
            <div className="bg-[#5C1515] p-2.5 rounded-xl border border-[#FFF7EE]/10 flex flex-col items-center text-center">
              <Bike size={20} className="text-amber-300 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">A Domicilio</span>
              <span className="text-[10px] text-[#FFF3DE]/70">Pasto urbano</span>
            </div>
            <div className="bg-[#5C1515] p-2.5 rounded-xl border border-[#FFF7EE]/10 flex flex-col items-center text-center">
              <Heart size={20} className="text-rose-400 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">100% Fresco</span>
              <span className="text-[10px] text-[#FFF3DE]/70">Hecho al momento</span>
            </div>
            <div className="bg-[#5C1515] p-2.5 rounded-xl border border-[#FFF7EE]/10 flex flex-col items-center text-center">
              <Sparkles size={20} className="text-emerald-400 mb-1" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Desde $5.000</span>
              <span className="text-[10px] text-[#FFF3DE]/70">Precios justos</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pt-2">
            <a
              href={directOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <MessageCircle size={22} className="fill-white" />
              <span>Pedir por WhatsApp</span>
            </a>

            <a
              href="#menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FFF7EE] hover:bg-[#FFE8C2] text-[#7A1E1E] font-bold text-base rounded-full shadow-md active:scale-95 transition-all"
            >
              <span>Ver Menú Completo</span>
              <ArrowDown size={18} />
            </a>
          </div>
        </div>

        {/* Right Column: Hero Visual Official Emblem Showcase */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96">
            {/* Soft decorative glow background */}
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></div>

            {/* Circular frame containing the official Rincon Dulce logo */}
            <div className="relative w-full h-full rounded-full border-4 border-[#FFF3DE] shadow-2xl overflow-hidden bg-[#7A1E1E]">
              <Image
                src="/images/logo.png"
                alt="Rincón Dulce Pasto - Waffles, Helados y Postres"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Floating Price Burst Badge */}
            <div className="absolute -bottom-3 -right-2 price-burst text-sm sm:text-base z-10 shadow-xl">
              🍓 ¡Pide tu Domi Aquí!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
