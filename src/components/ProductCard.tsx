"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, Topping } from "@/lib/types";
import { formatCOP, buildSingleProductWhatsAppUrl } from "@/lib/formatters";
import { useCart } from "@/context/CartContext";
import { Plus, MessageCircle, Check, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  whatsappNumber: string;
  allToppings: Topping[];
  deliveryFee?: number;
}

export default function ProductCard({
  product,
  whatsappNumber,
  allToppings,
  deliveryFee = 4000,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    product.options && product.options.length > 0 && product.options[0].choices.length > 0
      ? product.options[0].choices[0]
      : undefined
  );
  const [showToppingModal, setShowToppingModal] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [justAdded, setJustAdded] = useState(false);

  // Extract base watermark word from category name
  const watermarkWord = product.category?.name
    ? product.category.name.toUpperCase().split(" ")[0]
    : "ANTOJO";

  // Calculate price with option adjustments or toppings
  const currentPrice = Number(product.price);
  const toppingsTotal = selectedToppings.reduce((sum, t) => sum + Number(t.price), 0);
  const finalPrice = currentPrice + toppingsTotal;

  const handleAddToCart = () => {
    addItem(product, selectedOption, selectedToppings);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
    setShowToppingModal(false);
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const directWhatsAppUrl = buildSingleProductWhatsAppUrl(
    whatsappNumber,
    product,
    selectedOption,
    selectedToppings,
    deliveryFee
  );

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden border border-[#7A1E1E]/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
        !product.is_available ? "opacity-75 grayscale-[30%]" : ""
      }`}
    >
      {/* Kinetic Watermark Background Word */}
      <div className="watermark-text">
        {watermarkWord}
      </div>

      <div>
        {/* Top Product Image Container */}
        <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-[#5C1515]">
          <Image
            src={
              product.image_url ||
              "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80"
            }
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Starburst / Price Burst Badge */}
          {product.badge_text && (
            <div className="absolute top-3 right-3 price-burst text-xs shadow-lg">
              {product.badge_text}
            </div>
          )}

          {/* Category Tag on top left */}
          {product.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider shadow-sm">
              {product.category.icon} {product.category.name}
            </span>
          )}

          {/* Sold Out Overlay */}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="px-4 py-2 bg-[#7A1E1E] text-white font-display text-lg uppercase tracking-wider rounded-lg shadow-lg rotate-[-6deg]">
                AGOTADO POR HOY
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative z-10 p-5 space-y-3">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-[#7A1E1E] tracking-wide leading-tight">
              {product.name}
            </h3>
            <span className="shrink-0 font-display text-xl font-black text-[#2B120E] bg-[#FFF7EE] px-2.5 py-1 rounded-lg border border-[#7A1E1E]/20">
              {formatCOP(finalPrice)}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-[#2B120E]/80 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Product Variant Options (e.g. Cono vs Vaso) */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider block">
                {product.options[0].name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.options[0].choices.map((choice) => (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setSelectedOption(choice)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      selectedOption === choice
                        ? "bg-[#7A1E1E] text-white border-[#7A1E1E] shadow-sm"
                        : "bg-[#FFF7EE] text-[#2B120E] border-[#7A1E1E]/20 hover:bg-[#FFE8C2]"
                    }`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Toppings Button */}
          {allToppings.length > 0 && (
            <button
              type="button"
              onClick={() => setShowToppingModal(!showToppingModal)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7A1E1E] hover:text-[#5C1515] underline underline-offset-2 transition-colors pt-1"
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>
                {selectedToppings.length > 0
                  ? `+ ${selectedToppings.length} Topping(s) elegidos (${formatCOP(toppingsTotal)})`
                  : "+ Personalizar con Toppings ($2.000 c/u)"}
              </span>
            </button>
          )}

          {/* Inline Toppings Dropdown/Selector */}
          {showToppingModal && (
            <div className="bg-[#FFF7EE] p-3 rounded-2xl border border-[#7A1E1E]/20 space-y-2 mt-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-bold text-[#7A1E1E]">
                <span>Elige tus toppings ($2.000 c/u):</span>
                <button
                  type="button"
                  onClick={() => setShowToppingModal(false)}
                  className="text-xs text-gray-500 hover:text-black"
                >
                  Listo ✓
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {allToppings.map((topping) => {
                  const isChecked = selectedToppings.some((t) => t.id === topping.id);
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => toggleTopping(topping)}
                      className={`text-left text-[11px] p-2 rounded-xl border flex items-center justify-between transition-all ${
                        isChecked
                          ? "bg-[#7A1E1E] text-white border-[#7A1E1E] font-bold"
                          : "bg-white text-[#2B120E] border-gray-200 hover:border-[#7A1E1E]"
                      }`}
                    >
                      <span className="truncate">{topping.name}</span>
                      {isChecked ? <Check size={12} /> : <Plus size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="relative z-10 p-5 pt-0 grid grid-cols-2 gap-2">
        {/* Direct WhatsApp Order */}
        <a
          href={product.is_available ? directWhatsAppUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-white transition-all ${
            product.is_available
              ? "bg-[#25D366] hover:bg-[#1EBE5A] active:scale-95 shadow-md"
              : "bg-gray-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          <MessageCircle size={16} />
          <span>Pedir Ya</span>
        </a>

        {/* Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.is_available}
          className={`flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
            product.is_available
              ? justAdded
                ? "bg-emerald-600 text-white shadow-md scale-95"
                : "bg-[#7A1E1E] hover:bg-[#5C1515] text-[#FFF7EE] active:scale-95 shadow-md"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {justAdded ? (
            <>
              <Check size={16} />
              <span>¡Listo!</span>
            </>
          ) : (
            <>
              <Plus size={16} />
              <span>Agregar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
