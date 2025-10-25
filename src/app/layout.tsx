import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "@/components/ui/sonner";
import {ThemeProvider} from "@/components/theme-provider";
import {Suspense} from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Book Your Salon Appointment | Salona",
    description: "Book your salon appointment online with Salona. Choose your favorite stylist, select services, and schedule instantly. Beauty made easy — anytime, anywhere.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <Suspense>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className={"flex min-h-screen flex-col"}>
                    <Navbar/>
                    <Toaster/>
                    <main className={"flex-grow"}>
                        {children}
                    </main>
                </div>
            </ThemeProvider>
            </body>
        </Suspense>
        </html>
    );
}
