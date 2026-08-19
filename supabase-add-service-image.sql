-- Add an image column to services (mirrors the products table)
alter table services add column if not exists image text not null default '';
