import React from "react";
import { Topping } from "@/lib/types";
import { formatCOP } from "@/lib/formatters";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface ToppingsSectionProps {
  toppings: Topping[];
}

export default function ToppingsSection({ toppings }: ToppingsSectionProps) {
  return (
    <section className="py-12 bg-[#7A1E1E] text-[#FFF7EE] relative overflow-hidden">
      {/* Decorative repeating typography in background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex flex-col justify-around leading-none overflow-hidden font-display text-7xl md:text-8xl text-white whitespace-nowrap">
        <div>TOPPINGS • EXTRA • CHOCOLATE • BROWNIE • OREO</div>
        <div>CREMA CHANTILLY • MORA • MANÍ • ANTOJOS</div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7EE]/10 border border-[#FFF7EE]/20 text-xs font-semibold text-amber-200">
            <Sparkles size={14} />
            <span>Dale tu toque personal</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wide">
            Toppings Adicionales
          </h2>
          <div className="inline-block price-burst text-sm sm:text-base mt-1">
            Solo {formatCOP(2000)} c/u
          </div>
          <p className="text-sm sm:text-base text-[#FFF3DE]/80 pt-1">
            Puedes agregar cualquiera de estos deliciosos toppings a tus Waffles, Bowls o Helados al hacer tu pedido.
          </p>
        </div>

        {/* Toppings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {toppings.map((topping, idx) => (
            <div
              key={topping.id || idx}
              className="bg-[#5C1515] p-4 rounded-2xl border border-[#FFF7EE]/15 shadow-md flex flex-col items-center text-center space-y-2 hover:bg-[#6D1919] hover:scale-105 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF7EE]/10 flex items-center justify-center text-amber-300 font-display text-lg">
                🍬
              </div>
              <span className="font-bold text-sm text-[#FFF7EE] leading-tight">
                {topping.name}
              </span>
              <span className="text-xs font-bold text-amber-300 bg-[#7A1E1E] px-2 py-0.5 rounded-full border border-amber-300/30">
                +{formatCOP(Number(topping.price))}
              </span>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center text-xs text-[#FFF3DE]/70 flex items-center justify-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Ingredientes de alta calidad preparados frescos cada día en Pasto.</span>
        </div>
      </div>
    </section>
  );
}
