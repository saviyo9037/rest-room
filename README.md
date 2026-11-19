# Fern & Flow — Kerala Homestay Website

A responsive homestay website prototype built with **Next.js App Router, React and TypeScript**.

## Included
- Responsive landing page, story, six sample rooms, experiences and gallery
- Booking enquiry form with check-in / check-out validation
- WhatsApp enquiry handoff
- Demo admin dashboard at `/#admin`
- Browser-local enquiry storage using `localStorage`

## Demo admin access
- Route: `/#admin`
- Email: `admin@fernflow.demo`
- Password: `stay123`

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Before production launch
This is still a front-end prototype. Enquiries are stored only in the visitor's browser; there is no shared database, secure authentication, live room availability, online payment, automated confirmation, or email notification. Replace the demo WhatsApp number in `app/page.tsx` (currently `919876543210`) and replace all sample property details, rates, contact details and imagery with owner-approved content.

For a production booking system, connect a backend/database and implement secure admin authentication and server-side enquiry storage.
