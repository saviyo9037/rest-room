import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"Resort Booking Studio",description:"Three resort websites, one shared booking system."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
