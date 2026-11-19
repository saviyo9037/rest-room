"use client";

import { FormEvent, useEffect, useState } from "react";

const rooms = [
  { name: "Garden Room", detail: "A calm, light-filled room with a private sit-out and garden views.", guests: "2 guests · Queen bed", price: "₹2,800", tag: "Most loved", image: "photo-1611892440504-42a792e24d32" },
  { name: "Forest Suite", detail: "Extra room to slow down, with warm textures and a generous lounge corner.", guests: "3 guests · King bed", price: "₹3,600", image: "photo-1616486338812-3dadae4b4ace" },
  { name: "Family Cottage", detail: "A cosy hideaway for families and friends travelling together.", guests: "4 guests · 2 beds", price: "₹4,500", image: "photo-1618221195710-dd6b41faaea6" },
  { name: "River View Room", detail: "A peaceful room with an open view and a quiet corner to unwind.", guests: "2 guests · Queen bed", price: "₹3,100", image: "photo-1616486029423-aaa4789e8c9a" },
  { name: "Courtyard Room", detail: "Simple comforts around a leafy courtyard, ideal for a restful break.", guests: "2 guests · Queen bed", price: "₹2,600", image: "photo-1615874694520-474822394e73" },
  { name: "Hilltop Family Room", detail: "A generous family space with room for everyone to settle in.", guests: "4 guests · 2 beds", price: "₹4,800", image: "photo-1617104678098-de229db51175" },
];
const photo = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

type Enquiry = { name: string; phone: string; checkin: string; checkout: string; guests: string; room: string; message: string; created: string };

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState<"enquiries" | "rooms">("enquiries");

  useEffect(() => {
    const syncRoute = () => setAdmin(window.location.hash === "#admin");
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    setLoggedIn(sessionStorage.getItem("fernflow_admin") === "yes");
    try { setEnquiries(JSON.parse(localStorage.getItem("fernflow_enquiries") || "[]")); } catch { setEnquiries([]); }
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 3200); };

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries()) as Record<string, string>;
    if (data.checkout <= data.checkin) { notify("Check-out date should be after check-in."); return; }
    const item: Enquiry = { name: data.name, phone: data.phone, checkin: data.checkin, checkout: data.checkout, guests: data.guests, room: data.room, message: data.message || "", created: new Date().toLocaleString() };
    const updated = [item, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem("fernflow_enquiries", JSON.stringify(updated));
    const message = `Hello, I would like to enquire about a stay at Fern & Flow.\nName: ${item.name}\nPhone: ${item.phone}\nCheck-in: ${item.checkin}\nCheck-out: ${item.checkout}\nGuests: ${item.guests}\nRoom: ${item.room}\nMessage: ${item.message || "N/A"}`;
    notify("Enquiry saved in this browser. Opening WhatsApp…");
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    event.currentTarget.reset();
  }

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (form.get("email") === "admin@fernflow.demo" && form.get("password") === "stay123") {
      sessionStorage.setItem("fernflow_admin", "yes"); setLoggedIn(true);
    } else notify("Use the demo credentials shown above.");
  }

  if (admin) return <main className="admin-shell">
    {!loggedIn ? <form className="login-card" onSubmit={signIn}><span className="eyebrow">Fern & Flow</span><h1>Admin sign in</h1><p>Demo dashboard · prototype only</p><label>Email<input name="email" type="email" defaultValue="admin@fernflow.demo" /></label><label>Password<input name="password" type="password" defaultValue="stay123" /></label><button className="button" type="submit">Sign in</button><small>Demo credentials: admin@fernflow.demo / stay123</small><a className="text-link" href="/">← Back to website</a></form> :
      <><div className="admin-header"><div><span className="eyebrow">Fern & Flow · Management</span><h1>Good day, admin.</h1></div><div className="admin-actions"><a className="outline-button" href="/">View website ↗</a><button className="outline-button" onClick={() => { sessionStorage.removeItem("fernflow_admin"); setLoggedIn(false); }}>Sign out</button></div></div>
      <div className="stats"><div><span>Total enquiries saved on this device</span><strong>{enquiries.length}</strong></div><div><span>Rooms displayed</span><strong>{rooms.length}</strong></div><div><span>Prototype status</span><strong className="status">Demo mode</strong></div></div>
      <div className="tabs"><button className={tab === "enquiries" ? "selected" : ""} onClick={() => setTab("enquiries")}>Enquiries</button><button className={tab === "rooms" ? "selected" : ""} onClick={() => setTab("rooms")}>Rooms</button></div>
      <section className="admin-panel"><h2>{tab === "enquiries" ? "Booking enquiries" : "Room overview"}</h2>{tab === "enquiries" ? enquiries.length ? <div className="table-scroll"><table><thead><tr><th>Name</th><th>Phone</th><th>Dates</th><th>Guests</th><th>Room</th><th>Message</th></tr></thead><tbody>{enquiries.map((e, i) => <tr key={i}><td>{e.name}</td><td>{e.phone}</td><td>{e.checkin} → {e.checkout}</td><td>{e.guests}</td><td>{e.room}</td><td>{e.message || "—"}</td></tr>)}</tbody></table></div> : <p className="muted">No enquiries yet. Test the booking form on the website.</p> : rooms.map(r => <div className="room-admin" key={r.name}><b>{r.name}</b><span>{r.guests}</span><strong>{r.price} / night</strong></div>)}</section></>}
  </main>;

  return <><header className="topbar"><a href="#" className="brand">Fern & Flow<small>Kerala · Slow living</small></a><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button><nav className={menuOpen ? "nav open" : "nav"}>{[["Our story","#story"],["Stay","#rooms"],["Experience","#experience"],["Gallery","#gallery"],["Enquire now","#contact"]].map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav></header>
    <main><section className="hero"><div className="hero-inner"><span className="eyebrow">A little closer to nature</span><h1>Find your<br/>quiet place.</h1><p>A thoughtfully slow stay, tucked into the green heart of Kerala. Come for the stillness. Stay for the feeling.</p><a className="button light-button" href="#rooms">Discover your stay ↗</a></div><span className="hero-note">A homestay experience · Kerala, India</span></section>
    <section className="intro section" id="story"><div className="intro-image" /><div className="intro-copy"><span className="eyebrow">Welcome to Fern & Flow</span><h2>Where every day moves a little slower.</h2><p>Wake up to birdsong, breathe in the monsoon air and let the green do its thing. Fern & Flow is imagined as a warm, welcoming hideaway for travellers who want to experience Kerala beyond the usual itinerary.</p><p>Thoughtful rooms, familiar comforts and the kind of hospitality that makes a place feel like your own.</p><a className="text-link" href="#contact">Plan your stay ↗</a></div></section>
    <section className="section rooms-section" id="rooms"><div className="section-heading"><span className="eyebrow">Stay a while</span><h2>Rooms made for unwinding.</h2><p>Find a space that feels right. Each room pairs easy comfort with a little character and a view of the world outside.</p></div><div className="room-grid">{rooms.map((room, i) => <article className="room-card" key={room.name}><div className="room-photo" style={{backgroundImage:`url('${photo(room.image, 900)}')`}}>{room.tag && <span className="room-tag">{room.tag}</span>}</div><div className="room-info"><h3>{room.name}</h3><p>{room.detail}</p><div className="room-meta"><span>{room.guests}</span><strong>{room.price} <small>/ night</small></strong></div></div></article>)}</div></section>
    <section className="section experience" id="experience"><div className="section-heading"><span className="eyebrow">The little things</span><h2>More than just a room.</h2><p>Make space for the moments that turn a trip into a memory.</p></div><div className="experience-grid"><div><b>✳</b><h3>Local flavours</h3><p>Start the day with comforting Kerala flavours and fresh, seasonal ingredients.</p></div><div><b>⌁</b><h3>Nature nearby</h3><p>Explore quiet trails, village life and the beautiful landscape around you.</p></div><div><b>☼</b><h3>Time to reset</h3><p>Slow mornings, open spaces and a welcoming place to simply do nothing.</p></div></div></section>
    <section className="section gallery-section" id="gallery"><div className="section-heading"><span className="eyebrow">A glimpse of the stay</span><h2>Little moments, lovely spaces.</h2></div><div className="gallery-grid"><div style={{backgroundImage:`url('${photo("photo-1600210492486-724fe5c67fb0")}')`}}/><div style={{backgroundImage:`url('${photo("photo-1600607687920-4e2a09cf159d")}')`}}/><div style={{backgroundImage:`url('${photo("photo-1600607687939-ce8a6c25118c")}')`}}/><div style={{backgroundImage:`url('${photo("photo-1600566753086-00f18fb6b3ea")}')`}}/><div style={{backgroundImage:`url('${photo("photo-1600566753190-17f0baa2a6c3")}')`}}/></div></section>
    <section className="section booking-section" id="contact"><div className="booking-wrap"><div className="booking-copy"><span className="eyebrow">Your stay starts here</span><h2>Let's make a little getaway happen.</h2><p>Tell us what you have in mind. Share your dates and the number of guests, and our team will get back to you with availability and details.</p><p><b>Prefer a quick chat?</b><br/>Send your enquiry directly on WhatsApp.</p></div><form className="booking-form" onSubmit={submitEnquiry}><label>Your name<input name="name" required placeholder="Full name"/></label><label>Phone / WhatsApp<input name="phone" required type="tel" placeholder="+91"/></label><label>Check-in<input name="checkin" type="date" min={new Date().toISOString().slice(0,10)} required/></label><label>Check-out<input name="checkout" type="date" min={new Date().toISOString().slice(0,10)} required/></label><label>Guests<select name="guests"><option>1 Guest</option><option selected>2 Guests</option><option>3 Guests</option><option>4 Guests</option><option>5+ Guests</option></select></label><label>Room preference<select name="room"><option>Any available room</option>{rooms.map(r => <option key={r.name}>{r.name}</option>)}</select></label><label className="full-field">Anything else? (optional)<textarea name="message" placeholder="Special requests, questions..."/></label><button className="button full-field" type="submit">Send booking enquiry ↗</button></form></div></section></main>
    <footer className="footer"><div className="footer-top"><div><div className="brand">Fern & Flow<small>Kerala · Slow living</small></div><p>A quiet little hideaway in the green heart of Kerala. Replace this text with the homestay's real story and location.</p></div><div><b>Find us</b><p>Kerala, India<br/>Phone: +91 XXXXX XXXXX<br/>Email: hello@example.com</p></div><div><b>Explore</b><p><a href="#rooms">Rooms</a><br/><a href="#experience">Experiences</a><br/><a href="#contact">Booking enquiries</a></p></div></div><div className="footer-bottom"><span>© 2026 Fern & Flow. Demo concept website.</span><a href="#admin">Admin access</a></div></footer>
    {toast && <div className="toast">{toast}</div>}</>;
}
