import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
          .eq("user_id", userId)
          .maybeSingle();
        if (error) throw error;
        return !!data;
      };

      if (await read()) return true;
      return false;
    },
  });
}
