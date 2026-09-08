import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from environment or localStorage for flexible runtime configuration
export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_url') || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_custom_key') || '' : '';

  const url = envUrl || localUrl;
  const key = envKey || localKey;

  const isConfigured = Boolean(
    url && key && !url.includes('your-project') && url.startsWith('http')
  );

  return { url, key, isConfigured };
};

let cachedClient: SupabaseClient | null = null;
let cachedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (cachedClient && cachedKey === `${url}_${key}`) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    cachedKey = `${url}_${key}`;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const { isConfigured: isSupabaseConfigured } = getSupabaseConfig();
export const supabase = getSupabaseClient();

export const SUPABASE_SQL_SCHEMA = `-- 1. Profile Table
create table if not exists athlete_profile (
  id text primary key default 'default_athlete',
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 2. Seasons Table
create table if not exists seasons (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default now()
);

-- 3. Documents Table
create table if not exists vault_documents (
  id text primary key,
  data jsonb not null,
  created_at timestamp with time zone default now()
);

-- 4. Notes Table
create table if not exists vault_notes (
  id text primary key,
  content text not null,
  created_at timestamp with time zone default now()
);

-- 5. Memories Table
create table if not exists vault_memories (
  id text primary key,
  data jsonb not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) & Policies
alter table athlete_profile enable row level security;
alter table seasons enable row level security;
alter table vault_documents enable row level security;
alter table vault_notes enable row level security;
alter table vault_memories enable row level security;

create policy "Public Access Profile" on athlete_profile for all using (true) with check (true);
create policy "Public Access Seasons" on seasons for all using (true) with check (true);
create policy "Public Access Documents" on vault_documents for all using (true) with check (true);
create policy "Public Access Notes" on vault_notes for all using (true) with check (true);
create policy "Public Access Memories" on vault_memories for all using (true) with check (true);

-- 6. Storage Bucket & Policies for Media (Photos & Videos)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Drop existing policies if already defined to prevent duplicate errors
drop policy if exists "Public Media Access" on storage.objects;
drop policy if exists "Public Media Insert" on storage.objects;
drop policy if exists "Public Media Update" on storage.objects;
drop policy if exists "Public Media Delete" on storage.objects;
drop policy if exists "Allow Public Uploads" on storage.objects;
drop policy if exists "Allow Public Select" on storage.objects;

-- Allow public read/download
create policy "Public Media Access" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

-- Allow public upload
create policy "Public Media Insert" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'media');

-- Allow public update & delete
create policy "Public Media Update" on storage.objects
  for update to anon, authenticated using (bucket_id = 'media');

create policy "Public Media Delete" on storage.objects
  for delete to anon, authenticated using (bucket_id = 'media');
`;
