"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Product, Category, Topping, BusinessSettings } from "@/lib/types";
import {
  adminGetAllProducts,
  adminGetAllCategories,
  adminGetAllToppings,
  adminUpsertProduct,
  adminDeleteProduct,
  adminUpsertCategory,
  adminDeleteCategory,
  adminUpsertTopping,
  adminDeleteTopping,
  adminUpdateSettings,
  adminUploadProductImage,
  adminSeedDatabase,
  getBusinessSettings,
} from "@/lib/services/menu";
import {
  initialSettings,
  initialProducts,
  initialCategories,
  initialToppings,
} from "@/lib/mock-data";
import { formatCOP } from "@/lib/formatters";
import Logo from "@/components/Logo";
import {
  Lock,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  AlertCircle,
  Settings,
  Utensils,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  ArrowLeft,
} from "lucide-react";

export default function AdminPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "toppings" | "settings">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [loadingData, setLoadingData] = useState(false);
  const [tableMissingError, setTableMissingError] = useState<string | null>(null);
  const [seedingLoading, setSeedingLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Check auth session
  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured || !supabase) {
        setLoadingAuth(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSessionUser(session?.user || null);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSessionUser(session?.user || null);
          }
        );

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();
  }, []);

  // Fetch admin data once user is logged in
  useEffect(() => {
    if (sessionUser || !isSupabaseConfigured) {
      loadDashboardData();
    }
  }, [sessionUser]);

  const showFeedback = (type: "success" | "error", text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  const loadDashboardData = async () => {
    setLoadingData(true);
    setTableMissingError(null);
    try {
      const [prodsRes, catsRes, topsRes, setsRes] = await Promise.allSettled([
        adminGetAllProducts(),
        adminGetAllCategories(),
        adminGetAllToppings(),
        getBusinessSettings(),
      ]);

      if (prodsRes.status === "fulfilled") {
        setProducts(prodsRes.value);
      } else {
        const msg = prodsRes.reason?.message || "";
        if (msg.includes("no existen") || msg.includes("does not exist") || msg.includes("42P01")) {
          setTableMissingError(
            "Las tablas de Supabase aún no existen. Debes ejecutar el archivo supabase/schema.sql en el SQL Editor de Supabase."
          );
        } else {
          showFeedback("error", msg);
        }
      }

      if (catsRes.status === "fulfilled") {
        setCategories(catsRes.value);
      }

      if (topsRes.status === "fulfilled") {
        setToppings(topsRes.value);
      }

      if (setsRes.status === "fulfilled" && setsRes.value) {
        setSettings(setsRes.value);
      }
    } catch (err: any) {
      showFeedback("error", err.message || "Error al cargar datos.");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSeedMenu = async () => {
    setSeedingLoading(true);
    try {
      const res = await adminSeedDatabase();
      showFeedback("success", res.message);
      await loadDashboardData();
    } catch (err: any) {
      const msg = err.message || "";
      showFeedback("error", msg);
      if (msg.includes("no existen") || msg.includes("does not exist") || msg.includes("42P01") || msg.includes("relation")) {
        setTableMissingError(
          "Las tablas de Supabase aún no han sido creadas. Ve al SQL Editor en Supabase y ejecuta el código de supabase/schema.sql."
        );
      }
    } finally {
      setSeedingLoading(false);
    }
  };

  // Auth Handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      setAuthError("Debes configurar NEXT_PUBLIC_SUPABASE_URL y ANON_KEY en tu archivo .env.local");
      setAuthLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.session) {
          setSessionUser(data.session.user);
          showFeedback("success", "¡Cuenta creada y sesión iniciada!");
        } else {
          // Intenta login inmediato automático
          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (!signInErr && signInData.session) {
            setSessionUser(signInData.session.user);
            showFeedback("success", "¡Bienvenido a Rincón Dulce Admin!");
          } else {
            showFeedback("success", "Cuenta creada. Ya puedes iniciar sesión con tu clave.");
            setIsSignUp(false);
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSessionUser(data.user);
        showFeedback("success", "¡Bienvenido a Rincón Dulce Admin!");
      }
    } catch (err: any) {
      setAuthError(err.message || "Error de autenticación");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSessionUser(null);
  };

  // Product Actions
  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const updated = await adminUpsertProduct({
        ...product,
        is_available: !product.is_available,
      });
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      showFeedback(
        "success",
        `"${product.name}" marcado como ${!product.is_available ? "Disponible" : "Agotado"}`
      );
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}" del menú?`)) return;
    try {
      await adminDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showFeedback("success", `Producto "${name}" eliminado.`);
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showFeedback("error", "Nombre y precio son requeridos.");
      return;
    }

    try {
      const saved = await adminUpsertProduct(editingProduct);
      setProducts((prev) => {
        const index = prev.findIndex((p) => p.id === saved.id);
        if (index >= 0) {
          const clone = [...prev];
          clone[index] = saved;
          return clone;
        }
        return [...prev, saved];
      });
      setIsProductModalOpen(false);
      setEditingProduct(null);
      showFeedback("success", "Producto guardado correctamente.");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const publicUrl = await adminUploadProductImage(file);
      setEditingProduct((prev) => ({ ...prev, image_url: publicUrl }));
      showFeedback("success", "Imagen subida a Supabase Storage.");
    } catch (err: any) {
      showFeedback("error", err.message || "Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      const updated = await adminUpdateSettings(settings);
      setSettings(updated);
      showFeedback("success", "Configuración del negocio actualizada.");
    } catch (err: any) {
      showFeedback("error", err.message);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF7EE] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#7A1E1E] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-display text-sm uppercase text-[#7A1E1E]">Cargando Rincón Dulce Admin...</span>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN (if user not authenticated and Supabase configured)
  if (!sessionUser && isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#FFF7EE] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#7A1E1E]/20 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <Logo size="md" showText={false} />
            <h1 className="font-display text-3xl font-bold uppercase text-[#7A1E1E] tracking-wide">
              Panel Administrativo
            </h1>
            <p className="text-xs text-[#2B120E]/70 font-serif-bistro italic">
              Rincón Dulce Pasto • Gestión del Menú
            </p>
          </div>

          {authError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rincondulcepasto.com"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 bg-[#7A1E1E] hover:bg-[#5C1515] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              <span>{authLoading ? "Verificando..." : isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-[#7A1E1E] hover:underline"
            >
              {isSignUp ? "¿Ya tienes cuenta? Inicia sesión" : "¿Primera vez? Crear cuenta admin"}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black"
            >
              <ArrowLeft size={14} />
              <span>Volver a la página principal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FFF7EE] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#7A1E1E] text-white px-4 py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <span className="font-display text-lg font-bold uppercase tracking-wider block leading-tight">
                Panel Rincón Dulce
              </span>
              <span className="text-[10px] text-amber-200 font-semibold">
                {sessionUser ? sessionUser.email : "Modo Local / Vista Previa"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedMenu}
              disabled={seedingLoading}
              className="px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-400/30"
              title="Cargar el menú inicial a Supabase"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span>{seedingLoading ? "Cargando..." : "Cargar Menú Inicial"}</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Ver Tienda</span>
            </Link>

            {sessionUser && (
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-full bg-rose-600/80 hover:bg-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notice if Supabase is not yet connected */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-100 border-b border-amber-300 px-4 py-2.5 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto">
            <AlertCircle size={16} className="shrink-0 text-amber-700" />
            <span>
              <strong>Supabase aún no está conectado:</strong> Los datos se están visualizando desde la configuración inicial. Para activar la base de datos y autenticación en la nube, añade tus credenciales en <code>.env.local</code>.
            </span>
          </div>
        </div>
      )}

      {/* Floating feedback alert */}
      {feedbackMsg && (
        <div
          className={`fixed top-16 right-5 z-50 p-4 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            feedbackMsg.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {feedbackMsg.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#7A1E1E]/10">
        <div className="max-w-6xl mx-auto px-4 flex gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "products"
                ? "bg-[#7A1E1E] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Utensils size={15} />
            <span>Productos ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "categories"
                ? "bg-[#7A1E1E] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Layers size={15} />
            <span>Categorías ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("toppings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "toppings"
                ? "bg-[#7A1E1E] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Sparkles size={15} />
            <span>Toppings ({toppings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "settings"
                ? "bg-[#7A1E1E] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Settings size={15} />
            <span>Ajustes Negocio</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Table Missing Alert Banner */}
        {tableMissingError && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 text-amber-900 space-y-3 shadow-md">
            <div className="flex items-center gap-2 font-bold text-base text-amber-950">
              <AlertCircle size={22} className="text-amber-700 shrink-0" />
              <span>Paso pendiente en Supabase: Crear las tablas de la base de datos</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Ya conectaste Supabase con Vercel, pero las tablas del menú aún no existen en la base de datos. Para crearlas en 1 minuto:
            </p>
            <ol className="text-xs sm:text-sm list-decimal list-inside space-y-1.5 font-medium bg-white/80 p-4 rounded-2xl border border-amber-200">
              <li>Entra a tu proyecto en <strong>supabase.com</strong>.</li>
              <li>En la barra lateral izquierda, haz clic en <strong>SQL Editor</strong> (icono de terminal <code>&gt;_</code>).</li>
              <li>Abre el archivo <strong><code>supabase/schema.sql</code></strong> de este proyecto, copia todo su contenido y pégalo allí.</li>
              <li>Haz clic en el botón verde <strong>Run</strong> (Correr).</li>
            </ol>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={loadDashboardData}
                className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
              >
                🔄 Ya ejecuté el SQL, Recargar
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: PRODUCTOS */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
                  Gestión de Productos
                </h2>
                <p className="text-xs text-gray-500">
                  Edita precios, fotos y marca productos como agotados con un solo toque desde tu celular.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {products.length === 0 && (
                  <button
                    onClick={handleSeedMenu}
                    disabled={seedingLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                  >
                    <Sparkles size={16} />
                    <span>{seedingLoading ? "Cargando..." : "Cargar Menú Inicial"}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: "",
                      price: 13000,
                      category_id: categories[0]?.id || "",
                      is_available: true,
                      is_hidden: false,
                      badge_text: "NUEVO",
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7A1E1E] hover:bg-[#5C1515] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
                >
                  <Plus size={16} />
                  <span>Nuevo Producto</span>
                </button>
              </div>
            </div>

            {/* Empty State or Product Cards List */}
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-[#7A1E1E]/20 space-y-4 max-w-lg mx-auto shadow-sm my-6">
                <span className="text-5xl block">🧇</span>
                <h3 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
                  Tu Base de Datos en Supabase está vacía
                </h3>
                <p className="text-xs text-[#2B120E]/70 max-w-sm mx-auto leading-relaxed">
                  Aún no hay productos guardados en Supabase. Si ya ejecutaste el SQL en Supabase, haz clic abajo para cargar el menú inicial de Rincón Dulce (Waffles, Bowls, Helados y Toppings) con un solo toque:
                </p>
                <button
                  onClick={handleSeedMenu}
                  disabled={seedingLoading}
                  className="px-6 py-3.5 bg-[#7A1E1E] hover:bg-[#5C1515] active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>{seedingLoading ? "Guardando en Supabase..." : "📥 Cargar Menú Completo a Supabase"}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border p-4 shadow-sm flex flex-col justify-between transition-all ${
                    !product.is_available ? "border-rose-200 bg-rose-50/30" : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border">
                      <Image
                        src={
                          product.image_url ||
                          "https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=200&q=80"
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase text-[#7A1E1E] bg-[#FFF7EE] px-2 py-0.5 rounded-full border border-[#7A1E1E]/20 inline-block mb-1">
                        {product.category?.name || "Sin categoría"}
                      </span>
                      <h3 className="font-display text-base font-bold text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs font-black text-[#7A1E1E]">
                        {formatCOP(product.price)}
                      </p>
                      {product.badge_text && (
                        <span className="text-[10px] text-gray-500 block truncate">
                          Badge: {product.badge_text}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Toggle Controls */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Available / Out of stock toggle button */}
                    <button
                      onClick={() => handleToggleProductAvailability(product)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        product.is_available
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {product.is_available ? "✓ Disponible" : "✗ Agotado"}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 text-gray-600 hover:text-[#7A1E1E] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Editar producto"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CATEGORÍAS */}
        {/* ============================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
                  Categorías del Menú
                </h2>
                <p className="text-xs text-gray-500">
                  Organiza las secciones del menú para que tus clientes encuentren rápido sus antojos.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCategory({
                    name: "",
                    slug: "",
                    icon: "🧇",
                    description: "",
                    order_num: categories.length + 1,
                    is_active: true,
                  });
                  setIsCategoryModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#7A1E1E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                <Plus size={16} />
                <span>Nueva Categoría</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-start justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-[#FFF7EE] rounded-xl">{cat.icon || "🍨"}</span>
                    <div>
                      <h3 className="font-display text-base font-bold text-[#7A1E1E]">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{cat.description}</p>
                      <span className="text-[10px] text-gray-400">Orden: {cat.order_num}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-black"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: TOPPINGS */}
        {/* ============================================================== */}
        {activeTab === "toppings" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
                Toppings Adicionales
              </h2>
              <p className="text-xs text-gray-500">
                Toppings disponibles para que los clientes agreguen a sus waffles, helados y bowls.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {toppings.map((topping) => (
                <div
                  key={topping.id}
                  className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-display text-base font-bold text-[#7A1E1E]">
                      {topping.name}
                    </h3>
                    <p className="text-xs font-black text-amber-600">
                      +{formatCOP(topping.price)}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const updated = await adminUpsertTopping({
                          ...topping,
                          is_available: !topping.is_available,
                        });
                        setToppings((prev) =>
                          prev.map((t) => (t.id === updated.id ? updated : t))
                        );
                        showFeedback("success", `Topping actualizado.`);
                      } catch (err: any) {
                        showFeedback("error", err.message);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      topping.is_available
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {topping.is_available ? "Disponible" : "Agotado"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: AJUSTES DEL NEGOCIO */}
        {/* ============================================================== */}
        {activeTab === "settings" && settings && (
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm max-w-3xl space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
                Ajustes Generales del Negocio
              </h2>
              <p className="text-xs text-gray-500">
                Cambia el número de WhatsApp receptor, los horarios de Pasto y el texto principal.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Número de WhatsApp (con código país)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) =>
                      setSettings({ ...settings, whatsapp_number: e.target.value })
                    }
                    placeholder="573180000000"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                  <span className="text-[10px] text-gray-500">
                    Ejemplo para Colombia: 57 seguido de tu número de 10 dígitos.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Usuario de Instagram
                  </label>
                  <input
                    type="text"
                    value={settings.instagram_handle}
                    onChange={(e) =>
                      setSettings({ ...settings, instagram_handle: e.target.value })
                    }
                    placeholder="rincondulcepasto"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    🛵 Tarifa de Domicilio en Pasto (COP)
                  </label>
                  <input
                    type="number"
                    value={settings.delivery_fee ?? 4000}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        delivery_fee: Number(e.target.value),
                      })
                    }
                    placeholder="4000"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                  <span className="text-[10px] text-gray-500">
                    Valor estándar que se sumará al subtotal del carrito y en el mensaje de WhatsApp.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={settings.schedule_text}
                    onChange={(e) =>
                      setSettings({ ...settings, schedule_text: e.target.value })
                    }
                    placeholder="Martes a Domingo: 2:00 PM - 9:00 PM"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                  Zonas y Cobertura de Domicilio
                </label>
                <textarea
                  rows={2}
                  value={settings.delivery_zones}
                  onChange={(e) =>
                    setSettings({ ...settings, delivery_zones: e.target.value })
                  }
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Título Principal del Hero
                  </label>
                  <input
                    type="text"
                    value={settings.hero_title}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_title: e.target.value })
                    }
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Estado Actual
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, is_open_now: !settings.is_open_now })
                    }
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase transition-all ${
                      settings.is_open_now
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {settings.is_open_now ? "🟢 Abierto Ahora" : "🔴 Cerrado Ahora"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#7A1E1E] hover:bg-[#5C1515] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                <Save size={16} />
                <span>Guardar Cambios</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* PRODUCT EDIT/CREATE MODAL */}
      {/* ============================================================== */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <h3 className="font-display text-2xl font-bold uppercase text-[#7A1E1E]">
              {editingProduct.id ? "Editar Producto" : "Nuevo Producto"}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ""}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="Ej: Waffle Chocoberry"
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Precio en COP
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    placeholder="13000"
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                    Categoría
                  </label>
                  <select
                    value={editingProduct.category_id || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category_id: e.target.value,
                      })
                    }
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E] bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ingredientes y detalles que enamoran..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                  Texto del Sello / Burst Badge
                </label>
                <input
                  type="text"
                  value={editingProduct.badge_text || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      badge_text: e.target.value,
                    })
                  }
                  placeholder="Ej: PRECIO $13.000, TOP VENTAS..."
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7A1E1E]"
                />
              </div>

              {/* Image upload / URL */}
              <div>
                <label className="block text-xs font-bold text-[#7A1E1E] uppercase tracking-wider mb-1">
                  Foto del Producto
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploadingImage}
                      className="text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#7A1E1E] file:text-white hover:file:bg-[#5C1515]"
                    />
                    {uploadingImage && (
                      <span className="text-xs text-amber-600 animate-pulse">Subiendo...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingProduct.image_url || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image_url: e.target.value,
                      })
                    }
                    placeholder="O pega una URL de imagen..."
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-black"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#7A1E1E] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
