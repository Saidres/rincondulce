import React from "react";
import { Search, MessageSquare, Bike, Sparkles } from "lucide-react";

export default function HowToOrder() {
  const steps = [
    {
      num: "01",
      icon: <Search className="w-8 h-8 text-[#7A1E1E]" />,
      title: "Elige tus Antojos",
      desc: "Navega por nuestro menú digital en fotos reales, escoge tus waffles, helados o bowls favoritos y añade tus toppings preferidos.",
    },
    {
      num: "02",
      icon: <MessageSquare className="w-8 h-8 text-[#25D366]" />,
      title: "Pide por WhatsApp",
      desc: "Toca 'Pedir Ya' o arma tu pedido en el carrito. Se generará un mensaje automático con tu resumen para enviarlo al instante a nuestro chat.",
    },
    {
      num: "03",
      icon: <Bike className="w-8 h-8 text-[#7A1E1E]" />,
      title: "Recibe en Pasto",
      desc: "Preparamos tu postre fresco al momento y te lo enviamos a domicilio a tu casa u oficina. Paga fácil con Nequi, Daviplata o efectivo.",
    },
  ];

  return (
    <section className="py-16 bg-[#FFF7EE] border-b border-[#7A1E1E]/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1E1E]/10 text-[#7A1E1E] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Súper Fácil y Rápido</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#7A1E1E] tracking-wide">
            ¿Cómo pedir tu domicilio?
          </h2>
          <p className="text-sm sm:text-base text-[#2B120E]/80">
            Sin apps complicadas ni registros pesados. Directo de nuestro taller dulce a tu mesa.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="relative bg-white p-7 rounded-3xl border border-[#7A1E1E]/15 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center space-y-4"
            >
              {/* Number Badge */}
              <div className="absolute -top-4 bg-[#7A1E1E] text-[#FFF7EE] font-display text-sm font-bold px-3 py-1 rounded-full shadow-md">
                Paso {step.num}
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#FFF7EE] border border-[#7A1E1E]/20 flex items-center justify-center mt-2">
                {step.icon}
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#7A1E1E]">
                {step.title}
              </h3>

              <p className="text-sm text-[#2B120E]/80 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
