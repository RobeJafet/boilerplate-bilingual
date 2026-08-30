import localFont from "next/font/local";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`
                    ${geistSans.variable}
                    ${geistMono.variable}
                    antialiased 
                    min-h-screen flex 
                    flex-col`
                }
            >
                {children}
            </body>
        </html>
    );
}
