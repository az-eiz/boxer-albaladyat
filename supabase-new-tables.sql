-- Delivery zones (editable delivery costs/areas shown on the site)
create table if not exists delivery_zones (
    id uuid primary key default gen_random_uuid(),
    name text not null default '',
    description text not null default '',
    price_label text not null default '',
    icon text not null default 'truck',
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

alter table delivery_zones enable row level security;

create policy "Public can read delivery zones"
    on delivery_zones for select
    using (true);

create policy "Authenticated can manage delivery zones"
    on delivery_zones for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- Customer testimonials (admin-managed reviews shown on the site)
create table if not exists testimonials (
    id uuid primary key default gen_random_uuid(),
    author_name text not null default '',
    rating integer not null default 5,
    comment text not null default '',
    created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "Public can read testimonials"
    on testimonials for select
    using (true);

create policy "Authenticated can manage testimonials"
    on testimonials for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');
