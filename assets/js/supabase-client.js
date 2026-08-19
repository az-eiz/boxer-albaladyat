const SUPABASE_URL = "https://umqezfgbfznnhiqzkcfx.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtcWV6ZmdiZnpubmhpcXprY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwOTY2NzMsImV4cCI6MjEwMjY3MjY3M30.v-kBl4vXDGHa2xDO4Q3N5LD6ffp55nUtFJv3b_poqJk";

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);