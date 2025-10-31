import {sendWaitlistEmail} from "@/services/Resend";
import {NextResponse} from "next/server";

export async function WAITLIST_POST(req: Request) {
    const { to, name, date, time, serviceName} = await req.json();
    const data = await sendWaitlistEmail(to, name, date, time, serviceName);
    return NextResponse.json({ success: true, data });
}