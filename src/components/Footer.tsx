import React from "react";
import Logo from "./Logo";
import { MessageCircle, MapPin, Clock, Lock } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

interface FooterProps {
  instagramHandle?: string;
  whatsappNumber?: string;
  scheduleText?: string;
}

export default function Footer({
  instagramHandle = "rincondulcepasto",
  whatsappNumber = "573180000000",
  scheduleText = "Martes a Domingo: 2:00 PM - 9:00 PM",
}: FooterProps) {
  const cleanPhone = whatsappNumber.replace(/\D/g, "");

  return (
    <footer className="bg-[#501111] text-[#FFF7EE] border-t-4 border-[#7A1E1E] pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-[#FFF3DE]/80 max-w-sm leading-relaxed">
              Emprendimiento de postres artesanales en Pasto, Nariño. Waffles, bowls de fresas, helado soft y combinaciones dulces que alegran tu día.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#FFF7EE]/10 hover:bg-[#FFF7EE]/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1EBE5A] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} className="fill-white" />
              </a>
            </div>
          </div>

          {/* Quick Info */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-amber-200">
              Horario & Domicilios
            </h4>
            <div className="space-y-2 text-xs text-[#FFF3DE]/85">
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <span>{scheduleText}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <span>Pasto, Nariño, Colombia</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-base font-bold uppercase tracking-wider text-amber-200">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-[#FFF3DE]/85">
              <li>
                <a href="#hero" className="hover:text-amber-300 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-amber-300 transition-colors">
                  Menú Completo
                </a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-amber-300 transition-colors">
                  Zonas de Domicilio
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-amber-200/60 hover:text-amber-200 transition-colors pt-2"
                >
                  <Lock size={12} />
                  <span>Panel Administrador</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#FFF7EE]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF3DE]/60 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Rincón Dulce (@rincondulcepasto). Todos los derechos reservados.</p>
          <p>Hecho con amor y waffles en Pasto, Colombia 🧇🍓</p>
        </div>
      </div>
    </footer>
  );
}
