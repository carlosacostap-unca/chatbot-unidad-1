import { createClient } from "@supabase/supabase-js";

// Cliente para uso en el navegador — usa la anon key y respeta las políticas RLS.
// Es seguro exponerla en el cliente (es la clave pública del proyecto).
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
