import { CartItem, Product, Topping } from "./types";

/**
 * Formats a number as Colombian Pesos (e.g. 13000 -> "$13.000")
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generates a direct WhatsApp order URL for a single product
 */
export function buildSingleProductWhatsAppUrl(
  phone: string,
  product: Product,
  selectedOption?: string,
  selectedToppings?: Topping[],
  deliveryFee: number = 4000
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  let message = `¡Hola Rincón Dulce! 👋 Vi su menú web y quiero pedir:\n\n`;
  message += `🧇 *${product.name}*`;

  if (selectedOption) {
    message += ` (${selectedOption})`;
  }

  let productTotal = Number(product.price);

  if (selectedToppings && selectedToppings.length > 0) {
    const toppingsList = selectedToppings.map((t) => t.name).join(", ");
    message += `\n   + Toppings: ${toppingsList}`;
    productTotal += selectedToppings.reduce((acc, t) => acc + Number(t.price), 0);
  }

  message += ` - ${formatCOP(productTotal)}`;
  
  if (deliveryFee > 0) {
    message += `\n🛵 *Domicilio en Pasto:* ${formatCOP(deliveryFee)}`;
    message += `\n💰 *Total a pagar:* ${formatCOP(productTotal + deliveryFee)}`;
  } else {
    message += `\n💰 *Total a pagar:* ${formatCOP(productTotal)}`;
  }

  message += `\n\n📍 *Para domicilio en Pasto:*`;
  message += `\n- Nombre: `;
  message += `\n- Dirección exacta: `;
  message += `\n- Barrio: `;
  message += `\n- Medio de pago (Nequi / Daviplata / Efectivo): `;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp order URL for multiple items from the cart
 */
export function buildCartWhatsAppUrl(
  phone: string,
  items: CartItem[],
  customerNote?: string,
  deliveryFee: number = 4000,
  selectedBarrio?: string,
  customerAddress?: string,
  customerName?: string
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  let message = `¡Hola Rincón Dulce! 👋 Quiero hacer el siguiente pedido:\n\n`;

  let subtotal = 0;

  items.forEach((item, index) => {
    message += `${index + 1}. *${item.quantity}x ${item.product.name}*`;
    if (item.selectedOption) {
      message += ` (${item.selectedOption})`;
    }
    if (item.selectedToppings && item.selectedToppings.length > 0) {
      const toppings = item.selectedToppings.map((t) => t.name).join(", ");
      message += `\n   + Toppings: ${toppings}`;
    }
    message += ` - ${formatCOP(item.subtotal)}\n`;
    subtotal += item.subtotal;
  });

  message += `\n📦 *Subtotal productos:* ${formatCOP(subtotal)}`;
  
  if (deliveryFee > 0) {
    const barrioLabel = selectedBarrio ? ` (${selectedBarrio})` : "";
    message += `\n🛵 *Domicilio en Pasto${barrioLabel}:* ${formatCOP(deliveryFee)}`;
    message += `\n💵 *Total con domicilio:* ${formatCOP(subtotal + deliveryFee)}`;
  } else {
    message += `\n💵 *Total a pagar:* ${formatCOP(subtotal)}`;
  }

  if (customerNote && customerNote.trim()) {
    message += `\n📝 *Nota:* ${customerNote.trim()}`;
  }

  message += `\n\n📍 *Datos para el Domicilio (Pasto):*`;
  message += `\n- Barrio: ${selectedBarrio || ""}`;
  message += `\n- Dirección exacta: ${customerAddress || ""}`;
  message += `\n- Nombre: ${customerName || ""}`;
  message += `\n- Medio de pago (Nequi / Daviplata / Efectivo): `;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
