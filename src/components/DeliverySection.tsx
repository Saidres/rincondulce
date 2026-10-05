import React from "react";
import { Clock, MapPin, CreditCard, Bike, MessageCircle } from "lucide-react";
import { formatCOP } from "@/lib/formatters";

interface DeliverySectionProps {
  scheduleText?: string;
  deliveryZones?: string;
  whatsappNumber?: string;
  deliveryFee?: number;
}

export default function DeliverySection({
  scheduleText = "Martes a Domingo: 2:00 PM - 9:00 PM",
  deliveryZones = "Zona urbana de Pasto: Centro, Maridiaz, Pandiaco, Morasurco, Tamasagra, Palermo, Chapal, Torobajo y alrededores.",
  whatsappNumber = "573180000000",
  deliveryFee = 4000,
}: DeliverySectionProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");

  const zonesList = [
    "Centro",
    "Maridiaz",
    "Pandiaco",
    "Morasurco",
    "Tamasagra",
    "Palermo",
    "Chapal",
    "Torobajo",
    "Fatima",
    "San Ignacio",
    "Bomboná",
    "Y más...",
  ];

  return (
    <section id="delivery" className="py-16 bg-[#FFF2E0] border-b border-[#7A1E1E]/15">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Info Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="font-display text-sm uppercase tracking-wider text-[#7A1E1E] font-bold">
                🛵 Domicilios en Pasto, Nariño
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#7A1E1E] tracking-wide">
                Horarios y Cobertura
              </h2>
              <p className="text-sm sm:text-base text-[#2B120E]/80 leading-relaxed">
                Llevamos tus waffles calientitos y tus helados en su punto exacto hasta la puerta de tu casa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tarifa Domicilio */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#7A1E1E]/20 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-[#7A1E1E]">
                  <Bike size={18} />
                  <h3 className="font-display text-sm font-bold uppercase">Tarifa Domicilio</h3>
                </div>
                <p className="font-display text-2xl font-black text-[#7A1E1E]">
                  {formatCOP(deliveryFee)}
                </p>
                <span className="text-[10px] text-gray-500 block leading-tight">
                  Tarifa estándar casco urbano de Pasto
                </span>
              </div>

              {/* Horario */}
              <div className="bg-white p-4 rounded-2xl border border-[#7A1E1E]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-[#7A1E1E]">
                  <Clock size={18} />
                  <h3 className="font-display text-sm font-bold uppercase">Horario</h3>
                </div>
                <p className="text-xs font-semibold text-[#2B120E] leading-snug">
                  {scheduleText}
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                  • Abierto festivos
                </span>
              </div>

              {/* Medios de Pago */}
              <div className="bg-white p-4 rounded-2xl border border-[#7A1E1E]/15 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-[#7A1E1E]">
                  <CreditCard size={18} />
                  <h3 className="font-display text-sm font-bold uppercase">Pagos</h3>
                </div>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6F4EA] text-[#137333] rounded">
                    Nequi
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FCE8E6] text-[#C5221F] rounded">
                    Daviplata
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FEF7E0] text-[#B06000] rounded">
                    Efectivo
                  </span>
                </div>
              </div>
            </div>

            {/* Zonas Tags */}
            <div className="bg-white p-5 rounded-2xl border border-[#7A1E1E]/15 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#7A1E1E]">
                <MapPin size={20} />
                <h3 className="font-display text-lg font-bold uppercase">Barrios de Cobertura</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {zonesList.map((zone) => (
                  <span
                    key={zone}
                    className="px-3 py-1 bg-[#FFF7EE] border border-[#7A1E1E]/15 text-[#7A1E1E] text-xs font-semibold rounded-full"
                  >
                    📍 {zone}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#2B120E]/70 pt-1">
                ¿Vives en otra zona de Pasto? Escríbenos a WhatsApp para consultar la tarifa de domicilio.
              </p>
            </div>
          </div>

          {/* Right Column: Fast Contact Card */}
          <div className="lg:col-span-5 bg-[#7A1E1E] text-[#FFF7EE] p-8 rounded-3xl shadow-xl border-2 border-[#5C1515] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#FFF7EE]/15 mx-auto flex items-center justify-center">
              <Bike size={32} className="text-amber-300" />
            </div>

            <div className="space-y-2">
              <span className="price-burst text-xs">Pasto, Nariño</span>
              <h3 className="font-display text-3xl font-black uppercase tracking-wide">
                ¿Listo para calmar el antojo?
              </h3>
              <p className="text-sm text-[#FFF3DE]/90">
                Escríbenos directamente a WhatsApp y te atenderemos con la mejor sonrisa.
              </p>
            </div>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                "¡Hola Rincón Dulce! 👋 Quiero consultar el menú y pedir a domicilio en Pasto:"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-base rounded-full shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle size={22} className="fill-white" />
              <span>Pedir por WhatsApp Ahora</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
