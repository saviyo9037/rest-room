# Resort Booking Studio
A Next.js App Router prototype with three resort website experiences and one central admin dashboard.

Routes: /site1, /site2, /site3, /admin

Demo admin code: resortdemo

## Current prototype limitation
The live prototype uses browser localStorage for room edits, content changes and reservations. This makes the flow demonstrable in one browser, but data is not shared across devices and is not suitable for live customer bookings. The admin sign-in is a demo gate, not production authentication. Image uploads are stored as browser data URLs.

## Supabase production setup
1. Create a Supabase project.
2. Run supabase/migrations/001_initial_schema.sql in SQL editor.
3. Create a resort-media storage bucket and authenticated write policies.
4. Set values from .env.example in Vercel.
5. Replace localStorage helpers in lib/data.ts with server-side Supabase operations and Supabase Auth before real use.

The database migration includes a PostgreSQL exclusion constraint on room/date ranges to prevent overlapping bookings. Use [check-in, check-out) date ranges.

## Local development
npm install
npm run dev
npm run build
