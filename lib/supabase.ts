import { createClient } from "@supabase/supabase-js";

// Cliente con Service Role Key — solo para uso en el servidor (API routes).
// Nunca exponer SUPABASE_SERVICE_ROLE_KEY al cliente.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
