-- initial schema
create table if not exists public.customers (
  id bigserial primary key,
  name text not null,
  email text unique
);
