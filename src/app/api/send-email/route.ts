import { NextResponse } from "next/server";
import {sendBookingEmail} from "@/services/Resend";

export async function POST(req: Request) {
    const { to, name, date, time, serviceName, staffName } = await req.json();
    const data = await sendBookingEmail(to, name, date, time, serviceName, staffName);
    return NextResponse.json({ success: true, data });
}
