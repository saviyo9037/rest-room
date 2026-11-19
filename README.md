# Resort Booking Studio

A Next.js resort booking demo with three resort websites and one shared Supabase-backed booking system.

## Live website

- Main website: https://rest-room.vercel.app
- Mist & Moss: https://rest-room.vercel.app/site1
- The Aurel: https://rest-room.vercel.app/site2
- Fern & Fable: https://rest-room.vercel.app/site3
- Admin desk: https://rest-room.vercel.app/admin

## Repository

- GitHub: https://github.com/saviyo9037/rest-room
- Deployment branch: `resort-booking-system`

## Demo booking and payment

The booking flow uses the shared Supabase database. Checkout supports simulated UPI and card payments, plus pay-at-property. This is a demo only: no real payment is processed and no money is charged.

## Supabase setup

1. Create a Supabase project.
2. Apply the SQL migrations in `supabase/migrations` in order.
3. Create the `resort-media` storage bucket if you plan to use resort media uploads.
4. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your Vercel project.

## Local development

```bash
npm install
npm run dev
npm run build
```

The admin area is currently a limited demo view. Secure admin authentication and full room/content management should be completed before production use.
