import React from "react";
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Heading,
    Row,
    Column,
    Button,
} from "@react-email/components";

type BookingConfirmationProps = {
    customerName: string;
    salonName: string;
    date: string;
    time: string;
    serviceName: string;
    staffName?: string;
    contact?: string; // salon email or phone
    manageBookingUrl?: string;
};

export default function BookingConfirmationEmail({
                                                     customerName,
                                                     salonName,
                                                     date,
                                                     time,
                                                     serviceName,
                                                     staffName,
                                                     contact,
                                                     manageBookingUrl,
                                                 }: BookingConfirmationProps) {
    const brandColor = "#0f172a";
    const accent = "#7c3aed";

    return (
        <Html>
            <Head />
            <Preview>{`Your appointment at ${salonName} is confirmed`}</Preview>
            <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
                <Container style={{ backgroundColor: "#ffffff", margin: "24px auto", padding: "24px", borderRadius: 8, maxWidth: 600 }}>
                    <Section style={{ textAlign: "center", paddingBottom: 16 }}>
                        <Heading style={{ margin: 0, color: brandColor }}>{salonName}</Heading>
                        <Text style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: 14 }}>Booking confirmation</Text>
                    </Section>

                    <Section style={{ padding: "8px 0 0 0" }}>
                        <Heading style={{ fontSize: 20, margin: "8px 0", color: brandColor }}>
                            Hi {customerName},
                        </Heading>

                        <Text style={{ color: "#374151", fontSize: 16, lineHeight: 1.5 }}>
                            Thank you for booking your appointment with {salonName}! We’re excited to have you and can’t wait to give you the best beauty experience.
                        </Text>

                        <Section style={{ backgroundColor: "#f9fafb", borderRadius: 6, padding: 12, marginTop: 14 }}>
                            <Text style={{ fontWeight: 600, color: brandColor, margin: "0 0 8px 0" }}>Booking Details:</Text>

                            <Row>
                                <Column>
                                    <Text style={{ margin: "4px 0", color: "#374151" }}>• Date: {date}</Text>
                                    <Text style={{ margin: "4px 0", color: "#374151" }}>• Time: {time}</Text>
                                    <Text style={{ margin: "4px 0", color: "#374151" }}>• Service: {serviceName}</Text>
                                    <Text style={{ margin: "4px 0", color: "#374151" }}>• Stylist: {staffName ?? "—"}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Text style={{ color: "#374151", fontSize: 14, marginTop: 14 }}>
                            If you need to make any changes, you can manage your booking through your account or contact us at {contact ?? "the salon"}.
                        </Text>

                        {manageBookingUrl && (
                            <Section style={{ paddingTop: 12, textAlign: "center" }}>
                                <Button
                                    style={{ backgroundColor: accent, color: "#ffffff", borderRadius: 6, textDecoration: "none" }}
                                    href={manageBookingUrl}
                                >
                                    Manage your booking
                                </Button>
                            </Section>
                        )}

                        <Text style={{ marginTop: 18, color: "#374151" }}>
                            See you soon,
                        </Text>

                        <Text style={{ fontWeight: 600, marginTop: 4, color: brandColor }}>
                            The {salonName} Team
                        </Text>
                    </Section>

                    <Section style={{ borderTop: "1px solid #e5e7eb", marginTop: 20, paddingTop: 12 }}>
                        <Text style={{ color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
                            {salonName} — {contact ?? ""}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}
