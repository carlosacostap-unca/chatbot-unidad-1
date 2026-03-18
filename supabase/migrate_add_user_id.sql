-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- Migración: agregar user_id a chat_messages y actualizar políticas RLS

-- 1. Agregar columna user_id referenciando a los usuarios de Supabase Auth
alter table public.chat_messages
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2. Índice para consultas por usuario ordenadas por fecha
create index if not exists chat_messages_user_id_created_at_idx
  on public.chat_messages (user_id, created_at);

-- 3. Eliminar las políticas anteriores si existen para recrearlas
drop policy if exists "Users can read own messages" on public.chat_messages;
drop policy if exists "Users can insert own messages" on public.chat_messages;

-- 4. Políticas RLS: cada usuario solo puede acceder a sus propios mensajes
--    (La API usa service_role key y bypasea RLS, pero esto es defensa en profundidad)
create policy "Users can read own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);
