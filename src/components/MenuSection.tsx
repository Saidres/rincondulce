"use client";

import React, { useState } from "react";
import { Category, Product, Topping } from "@/lib/types";
import CategoryNav from "./CategoryNav";
import ProductCard from "./ProductCard";
import { UtensilsCrossed, Sparkles } from "lucide-react";

interface MenuSectionProps {
  categories: Category[];
  products: Product[];
  toppings: Topping[];
  whatsappNumber: string;
  deliveryFee?: number;
}

export default function MenuSection({
  categories,
  products,
  toppings,
  whatsappNumber,
  deliveryFee = 4000,
}: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category_id === activeCategory);

  const selectedCategoryObj = categories.find((c) => c.id === activeCategory);

  return (
    <section id="menu" className="relative py-12 bg-[#FFF7EE]">
      {/* Category Nav Sticky */}
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7A1E1E]/10 text-[#7A1E1E] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Preparados al Momento</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-[#7A1E1E] tracking-wide">
            {activeCategory === "all" ? "Nuestro Menú de Antojos" : selectedCategoryObj?.name}
          </h2>

          <p className="text-sm sm:text-base text-[#2B120E]/80 font-serif-bistro italic">
            {activeCategory === "all"
              ? "Selecciona tu postre favorito y pídelo directo a WhatsApp en Pasto"
              : selectedCategoryObj?.description || "Postres frescos y deliciosos"}
          </p>

          <span className="inline-block text-xs font-bold text-[#7A1E1E]/70 bg-white px-3 py-1 rounded-full border border-[#7A1E1E]/15">
            {filteredProducts.length} producto{filteredProducts.length === 1 ? "" : "s"} disponible{filteredProducts.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#7A1E1E]/15 space-y-3">
            <UtensilsCrossed size={36} className="mx-auto text-gray-400" />
            <h3 className="font-display text-xl font-bold uppercase text-[#7A1E1E]">
              No hay productos en esta categoría
            </h3>
            <p className="text-xs text-gray-500">
              Pronto agregaremos nuevas delicias en esta sección.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={whatsappNumber}
                allToppings={toppings}
                deliveryFee={deliveryFee}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
