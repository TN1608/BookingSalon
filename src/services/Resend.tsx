import React from "react";
import {Resend} from "resend";
import {render} from "@react-email/render";
import BookingConfirmationEmail from "@/components/BookingConfirmationEmail";
import WaitListConfirmationEmail from "@/components/WaitListConfirmationEmail";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

async function sendBookingEmail(to: string, name: string, date: string, time: string, serviceName: string, staffName: string) {
    const html = await render(
        <BookingConfirmationEmail
            customerName={name}
            salonName="SALONA"
            date={date}
            time={time}
            serviceName={serviceName}
            staffName={staffName}
        />
    );

    await resend.emails.send({
        // from: "SALONA <onboarding@sandbox-salona.resend.dev>",
        from: "Acme <onboarding@resend.dev>",
        to: [to],
        subject: "Your appointment is confirmed – thank you for booking with SALONA",
        html,
    });
}

async function sendWaitlistEmail(to: string, name: string, date: string, time: string, serviceName: string) {
    const html = await render(
        <WaitListConfirmationEmail customerName={name}
                                   salonName={"SALONA"}
                                   date={date}
                                   time={time}
                                   serviceName={serviceName}
        />
    )
    await resend.emails.send({
        // from: "SALONA <onboarding@sandbox-salona.resend.dev>",
        from: "Acme <onboarding@resend.dev>",
        to: [to],
        subject: "You're on the waitlist at SALONA",
        html,
    });
}

export {sendBookingEmail, sendWaitlistEmail};
