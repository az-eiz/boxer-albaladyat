-- Read-only: lists the current security rules so we can tighten them safely.
select tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
   or (schemaname = 'storage' and tablename = 'objects')
order by tablename, cmd;
