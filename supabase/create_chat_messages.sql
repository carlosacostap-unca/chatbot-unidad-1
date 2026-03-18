-- Ejecutar en el SQL Editor de Supabase (https://supabase.com/dashboard)
-- Table: chat_messages

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  text        not null,
  role        text        not null check (role in ('user', 'assistant')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

-- Índice para consultas por sesión ordenadas por tiempo
create index chat_messages_session_id_created_at_idx
  on public.chat_messages (session_id, created_at);

-- Row Level Security: la tabla es solo accesible desde el servidor
-- (service role key). El acceso público queda bloqueado.
alter table public.chat_messages enable row level security;
