import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  category: "men" | "women" | "kids" | "pajamas" | "offers";
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  sizes: string[] | null;
  is_active: boolean;
  created_at: string;
};

export type CartRow = {
  id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  products: Product | null;
};

/** Current auth session (null while loading is true). */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function useProducts(category: string, sort: string) {
  return useQuery({
    queryKey: ["products", category, sort],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase.from("products").select("*").eq("category", category);
      if (sort === "price-asc") q = q.order("price", { ascending: true });
      else if (sort === "price-desc") q = q.order("price", { ascending: false });
      else q = q.order("created_at", { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Product[];
    },
  });
}

export function useFavorites(userId: string | undefined) {
  return useQuery({
    queryKey: ["favorites", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("id, product_id, products(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as { id: string; product_id: string; products: Product | null }[];
    },
  });
}

export function useToggleFavorite(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, isFav }: { productId: string; isFav: boolean }) => {
      if (!userId) throw new Error("not-authenticated");
      if (isFav) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favorites")
          .insert({ user_id: userId, product_id: productId });
        if (error) throw error;
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["favorites", userId] }),
  });
}

export function useCart(userId: string | undefined) {
  return useQuery({
    queryKey: ["cart", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity, size, products(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as CartRow[];
    },
  });
}

export function useAddToCart(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, size }: { productId: string; size?: string }) => {
      if (!userId) throw new Error("not-authenticated");
      const { error } = await supabase.from("cart_items").upsert(
        { user_id: userId, product_id: productId, size: size ?? null, quantity: 1 },
        { onConflict: "user_id,product_id,size", ignoreDuplicates: false },
      );
      if (error) throw error;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
  });
}
