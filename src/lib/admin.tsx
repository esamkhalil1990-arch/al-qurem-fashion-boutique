import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { claimOwnerAdmin } from "./admin.functions";

/** True when the signed-in user has the admin role (owner accounts self-claim it). */
export function useIsAdmin(userId: string | undefined) {
  return useQuery({
    queryKey: ["is-admin", userId],
    enabled: !!userId,
    staleTime: 30_000,
    queryFn: async () => {
      const read = async () => {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("role", "admin")
          .maybeSingle();
        if (error) throw error;
        return !!data;
      };

      if (await read()) return true;
      try {
        const result = await claimOwnerAdmin();
        if (result.admin) return true;
      } catch {
        // not an owner account — stays a normal customer
      }
      return false;
    },
  });
}
