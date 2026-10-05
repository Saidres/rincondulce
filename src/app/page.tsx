import React from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MenuSection from "@/components/MenuSection";
import ToppingsSection from "@/components/ToppingsSection";
import HowToOrder from "@/components/HowToOrder";
import DeliverySection from "@/components/DeliverySection";
import InstagramGallery from "@/components/InstagramGallery";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartDrawer from "@/components/CartDrawer";
import {
  getCategories,
  getProducts,
  getToppings,
  getBusinessSettings,
} from "@/lib/services/menu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [categories, products, toppings, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getToppings(),
    getBusinessSettings(),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#FFF7EE]">
      {/* Fixed/Sticky Header */}
      <Header
        isOpenNow={settings.is_open_now}
        scheduleText={settings.schedule_text}
        whatsappNumber={settings.whatsapp_number}
        addressText={settings.address_text || "Cra. 31c No. 18-44 Las Cuadras"}
        mapsUrl={settings.maps_url || "https://maps.google.com/?q=Cra.+31c+No.+18-44+Las+Cuadras,+Pasto,+Nari%C3%B1o"}
      />

      {/* Hero Section */}
      <Hero
        heroTitle={settings.hero_title}
        heroSubtitle={settings.hero_subtitle}
        whatsappNumber={settings.whatsapp_number}
      />

      {/* Main Menu with Categories */}
      <MenuSection
        categories={categories}
        products={products}
        toppings={toppings}
        whatsappNumber={settings.whatsapp_number}
        deliveryFee={settings.delivery_fee}
      />

      {/* Toppings Showcase Section */}
      <ToppingsSection toppings={toppings} />

      {/* How To Order */}
      <HowToOrder />

      {/* Delivery Zones, Hours & Google Maps */}
      <DeliverySection
        scheduleText={settings.schedule_text}
        deliveryZones={settings.delivery_zones}
        whatsappNumber={settings.whatsapp_number}
        deliveryFee={settings.delivery_fee}
        addressText={settings.address_text || "Cra. 31c No. 18-44 Las Cuadras, San Juan de Pasto"}
        mapsUrl={settings.maps_url || "https://maps.google.com/?q=Cra.+31c+No.+18-44+Las+Cuadras,+Pasto,+Nari%C3%B1o"}
        neighborhoodTariffs={settings.neighborhood_tariffs || []}
      />

      {/* Instagram Gallery & Social proof */}
      <InstagramGallery instagramHandle={settings.instagram_handle} />

      {/* Footer */}
      <Footer
        instagramHandle={settings.instagram_handle}
        whatsappNumber={settings.whatsapp_number}
        scheduleText={settings.schedule_text}
      />

      {/* Floating WhatsApp and Cart components */}
      <FloatingWhatsApp whatsappNumber={settings.whatsapp_number} />
      <CartDrawer
        whatsappNumber={settings.whatsapp_number}
        deliveryFee={settings.delivery_fee}
        neighborhoodTariffs={settings.neighborhood_tariffs || []}
      />
    </main>
  );
}
