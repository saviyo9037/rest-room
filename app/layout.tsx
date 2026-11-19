import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fern & Flow — A Kerala Homestay",
  description: "A quiet Kerala homestay surrounded by greenery. Explore rooms and send a booking enquiry.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
