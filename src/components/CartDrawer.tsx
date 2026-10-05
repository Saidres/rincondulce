"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatCOP, buildCartWhatsAppUrl } from "@/lib/formatters";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";

import { NeighborhoodTariff } from "@/lib/types";

interface CartDrawerProps {
  whatsappNumber: string;
  deliveryFee?: number;
  neighborhoodTariffs?: NeighborhoodTariff[];
}

export default function CartDrawer({
  whatsappNumber,
  deliveryFee = 4000,
  neighborhoodTariffs = [],
}: CartDrawerProps) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  const [selectedBarrio, setSelectedBarrio] = useState<string>(
    neighborhoodTariffs.length > 0 ? neighborhoodTariffs[0].barrio : "Las Cuadras"
  );
  const [customBarrio, setCustomBarrio] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  // Determine delivery fee based on selected barrio
  const currentTariff = neighborhoodTariffs.find((t) => t.barrio === selectedBarrio);
  const currentDeliveryFee =
    selectedBarrio === "other"
      ? deliveryFee
      : currentTariff
      ? currentTariff.precio
      : deliveryFee;

  if (!isCartOpen) return null;

  const handleCheckoutWhatsApp = () => {
    const finalBarrio = selectedBarrio === "other" ? (customBarrio || "Otro barrio") : selectedBarrio;
    const url = buildCartWhatsAppUrl(
      whatsappNumber,
      items,
      customerNote,
      currentDeliveryFee,
      finalBarrio,
      customerAddress,
      customerName
    );
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FFF7EE] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-[#7A1E1E] text-[#FFF7EE] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-display text-xl font-bold uppercase tracking-wider">
              Mi Pedido ({totalCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Cerrar carrito"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content / Items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#7A1E1E]/10 flex items-center justify-center text-3xl">
                🧇
              </div>
              <h3 className="font-display text-xl font-bold uppercase text-[#7A1E1E]">
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-[#2B120E]/70 max-w-xs">
                ¡Elige tus waffles, bowls o helados favoritos del menú y agrégalos aquí!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-5 py-2 rounded-full bg-[#7A1E1E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#5C1515]"
              >
                Explorar el Menú
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-[#7A1E1E]/15">
                <span className="text-xs font-bold text-[#7A1E1E] uppercase">
                  Antojos Seleccionados
                </span>
                <button
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Vaciar</span>
                </button>
              </div>

              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-[#7A1E1E]/15 shadow-sm space-y-2"
                >
                  <div className="flex gap-3">
                    {/* Small thumbnail */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={
                          item.product.image_url ||
                          "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display text-base font-bold uppercase text-[#7A1E1E] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-rose-500 p-0.5"
                          aria-label="Eliminar producto"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {item.selectedOption && (
                        <p className="text-[11px] font-medium text-[#2B120E]/80">
                          {item.selectedOption}
                        </p>
                      )}

                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <p className="text-[10px] text-[#7A1E1E] font-medium truncate">
                          + {item.selectedToppings.map((t) => t.name).join(", ")}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-[#FFF7EE]">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-[#FFE8C2] text-gray-700"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-[#FFE8C2] text-gray-700"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="font-display text-base font-black text-[#2B120E]">
                          {formatCOP(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Destination & Neighborhood Selector */}
              <div className="pt-3 border-t border-[#7A1E1E]/15 space-y-3 bg-[#FFF3DE]/60 p-3 rounded-2xl">
                <div>
                  <label
                    htmlFor="select-barrio"
                    className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1 flex items-center justify-between"
                  >
                    <span>📍 ¿A qué barrio de Pasto va tu pedido?</span>
                    <span className="text-[11px] font-black text-[#2B120E] bg-white px-2 py-0.5 rounded-md border border-[#7A1E1E]/20">
                      Envío: {formatCOP(currentDeliveryFee)}
                    </span>
                  </label>
                  <select
                    id="select-barrio"
                    value={selectedBarrio}
                    onChange={(e) => setSelectedBarrio(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-[#7A1E1E]/30 bg-white text-[#2B120E] focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  >
                    {neighborhoodTariffs.map((t) => (
                      <option key={t.barrio} value={t.barrio}>
                        {t.barrio} — {formatCOP(t.precio)}
                      </option>
                    ))}
                    <option value="other">Otro barrio / Consultar tarifa en WhatsApp</option>
                  </select>
                </div>

                {selectedBarrio === "other" && (
                  <div>
                    <label
                      htmlFor="custom-barrio"
                      className="block text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider mb-1"
                    >
                      Escribe el nombre de tu barrio:
                    </label>
                    <input
                      id="custom-barrio"
                      type="text"
                      value={customBarrio}
                      onChange={(e) => setCustomBarrio(e.target.value)}
                      placeholder="Ej: Buesaquillo, Catambuco, San Ignacio..."
                      className="w-full text-xs p-2 rounded-xl border border-[#7A1E1E]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="customer-name"
                      className="block text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider mb-1"
                    >
                      Tu Nombre:
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ej: Camilo"
                      className="w-full text-xs p-2 rounded-xl border border-[#7A1E1E]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="customer-address"
                      className="block text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider mb-1"
                    >
                      Dirección exacta:
                    </label>
                    <input
                      id="customer-address"
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Ej: Cra 31c #18-44 Apt 201"
                      className="w-full text-xs p-2 rounded-xl border border-[#7A1E1E]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                    />
                  </div>
                </div>

                {/* Note field */}
                <div>
                  <label
                    htmlFor="customer-note"
                    className="block text-[11px] font-bold text-[#7A1E1E] uppercase tracking-wider mb-1"
                  >
                    📝 Indicaciones especiales:
                  </label>
                  <textarea
                    id="customer-note"
                    rows={2}
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="Ej: Salsa de chocolate aparte, timbre no funciona..."
                    className="w-full text-xs p-2 rounded-xl border border-[#7A1E1E]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-[#7A1E1E]/15 shadow-xl space-y-3">
            <div className="space-y-1.5 text-xs text-[#2B120E]/80 pb-2 border-b border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal productos:</span>
                <span className="font-bold text-[#2B120E]">{formatCOP(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-[#7A1E1E]">
                <span className="font-semibold">
                  🛵 Domicilio Pasto ({selectedBarrio === "other" ? (customBarrio || "Otro") : selectedBarrio}):
                </span>
                <span className="font-bold">{formatCOP(currentDeliveryFee)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-display text-sm uppercase font-bold text-[#7A1E1E]">
                Total a Pagar:
              </span>
              <span className="font-display text-2xl font-black text-[#2B120E]">
                {formatCOP(totalPrice + currentDeliveryFee)}
              </span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#25D366] hover:bg-[#1EBE5A] text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle size={20} className="fill-white" />
              <span>Enviar Pedido a WhatsApp</span>
              <ArrowRight size={18} />
            </button>

            <p className="text-[10px] text-center text-[#2B120E]/60">
              Al hacer clic se abrirá WhatsApp con el resumen listo para enviar a Rincón Dulce.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
