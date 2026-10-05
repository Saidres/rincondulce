import React from "react";
import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";
import { InstagramIcon } from "./icons/InstagramIcon";

interface InstagramGalleryProps {
  instagramHandle?: string;
}

export default function InstagramGallery({
  instagramHandle = "rincondulcepasto",
}: InstagramGalleryProps) {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80",
      title: "Waffle con Helado y Sirope",
    },
    {
      url: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
      title: "Bowl de Fresas y Crema Chantilly",
    },
    {
      url: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80",
      title: "Helado Soft Cremoso en Cono",
    },
    {
      url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
      title: "Heladísimo con Brownie",
    },
  ];

  return (
    <section className="py-16 bg-[#FFF7EE]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-display text-xs uppercase tracking-wider text-[#7A1E1E] font-bold">
              📸 Antojos en Vivo
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-[#7A1E1E] tracking-wide">
              Síguenos en Instagram
            </h2>
            <p className="text-sm text-[#2B120E]/70 font-serif-bistro italic">
              Mira nuestras historias diarias con promociones y nuevos sabores
            </p>
          </div>

          <a
            href={`https://instagram.com/${instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all"
          >
            <InstagramIcon size={18} />
            <span>@{instagramHandle}</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {photos.map((photo, idx) => (
            <a
              key={idx}
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-[#5C1515]"
            >
              <Image
                src={photo.url}
                alt={photo.title}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-3 text-center">
                <Heart size={24} className="text-rose-400 mb-1 animate-pulse" />
                <span className="font-display text-xs uppercase tracking-wider leading-tight">
                  {photo.title}
                </span>
                <span className="text-[10px] text-white/80 mt-1">Ver en Instagram</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
