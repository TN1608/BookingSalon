// Strong typing for booking constants
import {useState} from "react";
import {Star} from "lucide-react";

export interface Category {
    id: string;
    name: string
}

export interface Variant {
    id: string;
    name: string;
    duration: string;
    price: number
}

export interface Service {
    id: string
    name: string
    duration: string
    basePrice: number
    desc?: string
    variants: Variant[]
    categoryId?: string
}

export interface Stylist {
    id: string
    name: string
    specialties: Service["id"][]
    level: "junior" | "mid" | "senior"
    hourlyRate: number
    // Optional extended profile fields for ProfileDialog
    roleTitle?: string // e.g., "Senior Stylist"
    rating?: number // e.g., 5.0
    reviewCount?: number // e.g., 9
    appointmentsCompleted?: number
    clientsServed?: number
    languages?: string[]
    avatarUrl?: string
    bio?: string
    portfolio?: string[],
    reviews?: {
        id: number
        name: string
        date: string
        rating: number
        text: string
        avatar: string
    }[]
}

export interface Package {
    id: string
    name: string
    duration: string
    price: number
    includes: string[]
}

const CATEGORIES: Category[] = [
    {id: "haircuts", name: "Haircuts"},
    {id: "coloring", name: "Coloring"},
    {id: "styling", name: "Styling"},
    {id: "children", name: "Children"},
]

const SERVICES: Service[] = [
    {
        id: "women-haircut",
        name: "Women's Haircut",
        duration: "30 mins - 1 hr",
        basePrice: 150,
        desc: "Include hair wash. Extra charge for extra long & thick hair.",
        variants: [
            {id: "short-hair", name: "Short", duration: "30 mins", price: 150},
            {id: "medium-hair", name: "Medium", duration: "45 mins", price: 200},
            {id: "long-hair", name: "Long", duration: "1 hr", price: 250},
        ],
        categoryId: "haircuts",
    },
    {
        id: "mens-haircut",
        name: "Men's Haircut",
        duration: "20 - 40 mins",
        basePrice: 80,
        desc: "Classic and modern men's cuts. Includes quick styling.",
        variants: [
            {id: "basic-mens", name: "Basic", duration: "20 mins", price: 80},
            {id: "styled-mens", name: "Styled", duration: "40 mins", price: 120},
        ],
        categoryId: "haircuts",
    },
    {
        id: "kids-haircut",
        name: "Kids' Haircut",
        duration: "20 - 30 mins",
        basePrice: 60,
        desc: "For children under 12. Parent supervision required.",
        variants: [
            {id: "kids-short", name: "Short", duration: "20 mins", price: 60},
            {id: "kids-long", name: "Long", duration: "30 mins", price: 80},
        ],
        categoryId: "children",
    },
    {
        id: "full-color",
        name: "Full Color",
        duration: "1.5 - 3 hrs",
        basePrice: 300,
        desc: "Full color services including consultation and conditioning treatment.",
        variants: [
            {id: "partial-color", name: "Partial", duration: "1.5 hrs", price: 200},
            {id: "full-color-variant", name: "Full", duration: "3 hrs", price: 350},
        ],
        categoryId: "coloring",
    },
    {
        id: "blowout",
        name: "Blowout & Styling",
        duration: "45 mins - 1 hr",
        basePrice: 100,
        desc: "Wash, blow-dry and style for special occasions or everyday look.",
        variants: [
            {id: "quick-blowout", name: "Quick", duration: "45 mins", price: 100},
            {id: "deluxe-blowout", name: "Deluxe", duration: "1 hr", price: 140},
        ],
        categoryId: "styling",
    },
]

const STYLISTS: Stylist[] = [
    {
        id: "stylist-anna",
        name: "Fatin",
        specialties: ["women-haircut", "full-color", "blowout"],
        level: "senior",
        hourlyRate: 70,
        roleTitle: "Senior Stylist",
        rating: 5.0,
        reviewCount: 8,
        appointmentsCompleted: 143,
        clientsServed: 105,
        languages: ["English"],
        avatarUrl: "/avatars/fatin.jpg",
        bio: "Expert in women’s cuts, color transformations, and premium blowouts.",
        portfolio: [],
        reviews: [
            {
                id: 1,
                name: "Ananta K",
                date: "Tue, Oct 21, 2025 at 07:15",
                rating: 5,
                text: "Fatin did a fantastic job. She was patient, friendly and made sure my requirements were met. Highly recommend!!!!",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop",
            },
            {
                id: 2,
                name: "Priya M",
                date: "Mon, Oct 20, 2025 at 14:30",
                rating: 5,
                text: "Amazing experience! Fatin understood exactly what I wanted and delivered beyond expectations. Will definitely book again!",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop",
            },
            {
                id: 3,
                name: "Jessica L",
                date: "Sun, Oct 19, 2025 at 11:45",
                rating: 4,
                text: "Great service and very professional. The only thing is the wait time was a bit longer than expected, but the result was worth it!",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
            },
            {
                id: 4,
                name: "Sophia R",
                date: "Sat, Oct 18, 2025 at 16:20",
                rating: 5,
                text: "Absolutely love my new look! Fatin was so attentive to detail and made me feel comfortable throughout the entire session.",
                avatar: "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=96&h=96&fit=crop",
            },
            {
                id: 5,
                name: "Emma T",
                date: "Fri, Oct 17, 2025 at 09:15",
                rating: 5,
                text: "Best hair appointment I've had in years! Fatin listened to all my concerns and gave great advice on maintenance.",
                avatar: "https://images.unsplash.com/photo-1516746881182-e1a37c1b8b19?w=96&h=96&fit=crop",
            },
            {
                id: 6,
                name: "Maya P",
                date: "Thu, Oct 16, 2025 at 13:00",
                rating: 5,
                text: "Fantastic work! Very skilled and creative. I came in with just a vague idea and she transformed it into exactly what I needed.",
                avatar: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=96&h=96&fit=crop",
            },
            {
                id: 7,
                name: "Lina S",
                date: "Wed, Oct 15, 2025 at 10:30",
                rating: 5,
                text: "Fatin is a true artist! My balayage turned out perfect. She explained every step and made sure I was happy.",
                avatar: "https://images.unsplash.com/photo-1580489940927-477a0b3e3c7f?w=96&h=96&fit=crop",
            },
            {
                id: 8,
                name: "Rachel G",
                date: "Mon, Oct 13, 2025 at 15:45",
                rating: 5,
                text: "I've been searching for a stylist who gets my vision — Fatin nailed it on the first try! Already booked my next visit.",
                avatar: "https://images.unsplash.com/photo-1509967419530-da38b4708bc6?w=96&h=96&fit=crop",
            },
        ]
    },
    {
        id: "stylist-mike",
        name: "Mike",
        specialties: ["mens-haircut", "styling"],
        level: "mid",
        hourlyRate: 50,
        roleTitle: "Stylist",
        rating: 4.8,
        reviewCount: 7,
        appointmentsCompleted: 210,
        clientsServed: 180,
        languages: ["English"],
        avatarUrl: "/avatars/mike.jpg",
        bio: "Modern men’s styles, fades and event styling.",
        portfolio: [],
        reviews: [
            {
                id: 1,
                name: "James W",
                date: "Tue, Oct 22, 2025 at 09:00",
                rating: 5,
                text: "Best fade I've ever had. Mike is super precise and knows exactly how to shape it for my face. 10/10.",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop",
            },
            {
                id: 2,
                name: "Arjun P",
                date: "Mon, Oct 21, 2025 at 17:30",
                rating: 5,
                text: "Mike is the only one I trust with my taper. Clean, fast, and always on point. Highly recommend!",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop",
            },
            {
                id: 3,
                name: "David K",
                date: "Sun, Oct 20, 2025 at 12:15",
                rating: 4,
                text: "Great cut, very professional. A bit rushed at the end, but overall solid. Will come back.",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop",
            },
            {
                id: 4,
                name: "Ryan T",
                date: "Sat, Oct 19, 2025 at 10:45",
                rating: 5,
                text: "Mike transformed my messy hair into a sharp look for my interview. Got the job — thanks, man!",
                avatar: "https://images.unsplash.com/photo-1522556189639-b150cbcc4eeb?w=96&h=96&fit=crop",
            },
            {
                id: 5,
                name: "Chris L",
                date: "Fri, Oct 18, 2025 at 18:00",
                rating: 5,
                text: "Perfect skin fade every time. Mike remembers my preferences and always delivers. Top-tier barber!",
                avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=96&h=96&fit=crop",
            },
            {
                id: 6,
                name: "Omar H",
                date: "Wed, Oct 16, 2025 at 14:20",
                rating: 5,
                text: "Mike is a pro at textured crops. Gave me exactly what I showed in the photo. Super chill vibe too.",
                avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=96&h=96&fit=crop",
            },
            {
                id: 7,
                name: "Ethan M",
                date: "Mon, Oct 14, 2025 at 11:00",
                rating: 4,
                text: "Solid haircut, good attention to detail. A little pricey for a basic trim, but quality is there.",
                avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop",
            },
        ]
    },
    {
        id: "stylist-lee",
        name: "Lee",
        specialties: ["kids-haircut", "blowout"],
        level: "junior",
        hourlyRate: 40,
        roleTitle: "Junior Stylist",
        rating: 4.7,
        reviewCount: 6,
        appointmentsCompleted: 98,
        clientsServed: 90,
        languages: ["English"],
        avatarUrl: "/avatars/lee.jpg",
        bio: "Patient with kids, loves playful looks and soft waves.",
        portfolio: [],
        reviews: [
            {
                id: 1,
                name: "Sarah M",
                date: "Wed, Oct 23, 2025 at 10:00",
                rating: 5,
                text: "Lee was amazing with my 5-year-old! He was scared at first, but she made it fun and quick. Thank you!",
                avatar: "https://images.unsplash.com/photo-1487412720507-2c0ec767e19a?w=96&h=96&fit=crop",
            },
            {
                id: 2,
                name: "Nina R",
                date: "Tue, Oct 22, 2025 at 15:30",
                rating: 5,
                text: "My daughter loves her new bob! Lee was so gentle and patient. Best kids' stylist we've tried.",
                avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=96&h=96&fit=crop",
            },
            {
                id: 3,
                name: "Kelly T",
                date: "Sun, Oct 20, 2025 at 09:45",
                rating: 4,
                text: "Good experience overall. My son was happy with the cut, but it took a bit longer than expected.",
                avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop",
            },
            {
                id: 4,
                name: "Amy L",
                date: "Sat, Oct 19, 2025 at 11:20",
                rating: 5,
                text: "Lee is a gem! Handled my hyper 7-year-old like a pro. The cut was perfect and he left smiling.",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop",
            },
            {
                id: 5,
                name: "Grace H",
                date: "Fri, Oct 18, 2025 at 16:00",
                rating: 5,
                text: "Brought both kids — Lee did a great job on both. Fast, friendly, and great with little ones!",
                avatar: "https://images.unsplash.com/photo-1524504388944-b747f6c8be39?w=96&h=96&fit=crop",
            },
            {
                id: 6,
                name: "Monica P",
                date: "Mon, Oct 14, 2025 at 13:15",
                rating: 5,
                text: "My toddler usually cries during haircuts, but Lee was so calm and engaging — no tears! Magic!",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&fit=crop",
            },
        ]
    },
]

const PACKAGES: Package[] = [
    {
        id: "bridal-package",
        name: "Bridal Package",
        duration: "3 hrs",
        price: 500,
        includes: ["trial", "wedding-day", "touch-up"],
    },
    {
        id: "pamper-package",
        name: "Pamper Package",
        duration: "2 hrs",
        price: 220,
        includes: ["blowout", "deep-conditioning", "mini-style"],
    },
]


export type {Category as TCategory, Variant as TVariant, Service as TService, Stylist as TStylist, Package as TPackage}
export {CATEGORIES, SERVICES, STYLISTS, PACKAGES}