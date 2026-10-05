import { supabase, isSupabaseConfigured } from "../supabase/client";
import { Category, Product, Topping, BusinessSettings } from "../types";
import {
  initialCategories,
  initialProducts,
  initialToppings,
  initialSettings,
} from "../mock-data";

/**
 * PUBLIC API / FRONTEND QUERIES
 */

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialCategories;
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("order_num", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Using fallback categories:", error?.message);
      return initialCategories;
    }

    return data as Category[];
  } catch (err) {
    console.error("Error fetching categories:", err);
    return initialCategories;
  }
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialProducts;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_hidden", false)
      .order("order_num", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Using fallback products:", error?.message);
      return initialProducts;
    }

    return data as Product[];
  } catch (err) {
    console.error("Error fetching products:", err);
    return initialProducts;
  }
}

export async function getToppings(): Promise<Topping[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialToppings;
  }

  try {
    const { data, error } = await supabase
      .from("toppings")
      .select("*")
      .eq("is_available", true)
      .order("order_num", { ascending: true });

    if (error || !data || data.length === 0) {
      return initialToppings;
    }

    return data as Topping[];
  } catch (err) {
    console.error("Error fetching toppings:", err);
    return initialToppings;
  }
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  if (!isSupabaseConfigured || !supabase) {
    return initialSettings;
  }

  try {
    const { data, error } = await supabase
      .from("business_settings")
      .select("*")
      .eq("id", "main")
      .maybeSingle();

    if (error || !data) {
      return initialSettings;
    }

    return data as BusinessSettings;
  } catch (err) {
    console.error("Error fetching business settings:", err);
    return initialSettings;
  }
}

/**
 * ADMIN API (AUTHENTICATED ONLY)
 */

export async function adminGetAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialProducts;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .order("order_num", { ascending: true });

  if (error) throw error;
  return data as Product[];
}

export async function adminGetAllCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialCategories;
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_num", { ascending: true });

  if (error) throw error;
  return data as Category[];
}

export async function adminGetAllToppings(): Promise<Topping[]> {
  if (!isSupabaseConfigured || !supabase) {
    return initialToppings;
  }

  const { data, error } = await supabase
    .from("toppings")
    .select("*")
    .order("order_num", { ascending: true });

  if (error) throw error;
  return data as Topping[];
}

export async function adminUpsertProduct(product: Partial<Product>): Promise<Product> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado aún en las variables de entorno.");
  }

  // Clean out joined relation if present
  const { category, ...cleanProduct } = product;

  const { data, error } = await supabase
    .from("products")
    .upsert(cleanProduct)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado aún.");
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function adminUpsertCategory(category: Partial<Category>): Promise<Category> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado aún.");
  }

  const { data, error } = await supabase
    .from("categories")
    .upsert(category)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
}

export async function adminDeleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function adminUpsertTopping(topping: Partial<Topping>): Promise<Topping> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("toppings")
    .upsert(topping)
    .select()
    .single();

  if (error) throw error;
  return data as Topping;
}

export async function adminDeleteTopping(id: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { error } = await supabase.from("toppings").delete().eq("id", id);
  if (error) throw error;
}

export async function adminUpdateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado.");
  }

  const { data, error } = await supabase
    .from("business_settings")
    .upsert({ ...settings, id: "main" })
    .select()
    .single();

  if (error) throw error;
  return data as BusinessSettings;
}

export async function adminUploadProductImage(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase no está configurado para subir imágenes.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
