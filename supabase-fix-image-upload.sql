-- Allow public read + authenticated (logged-in admin) upload/replace/delete
-- of images in the "site-images" storage bucket used by the admin panel.

create policy "Public can view site images"
    on storage.objects for select
    using (bucket_id = 'site-images');

create policy "Authenticated can upload site images"
    on storage.objects for insert
    with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated can update site images"
    on storage.objects for update
    using (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "Authenticated can delete site images"
    on storage.objects for delete
    using (bucket_id = 'site-images' and auth.role() = 'authenticated');
