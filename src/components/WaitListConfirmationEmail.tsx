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

type WaitListConfirmationProps = {
    customerName: string;
    salonName: string;
    date?: string;
    time?: string;
    serviceName?: string;
    position?: number;
    estimatedWait?: string;
    contact?: string;
    manageBookingUrl?: string;
};

export default function WaitListConfirmationEmail({
                                                      customerName,
                                                      salonName,
                                                      date,
                                                      time,
                                                      serviceName,
                                                      position,
                                                      estimatedWait,
                                                      contact,
                                                      manageBookingUrl,
                                                  }: WaitListConfirmationProps) {
    const brandColor = "#0f172a";
    const accent = "#7c3aed";

    return (
        <Html>
            <Head />
            <Preview>{`You're on the waitlist at ${salonName}`}</Preview>
            <Body style={{ backgroundColor: "#f3f4f6", fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
                <Container style={{ backgroundColor: "#ffffff", margin: "24px auto", padding: "24px", borderRadius: 8, maxWidth: 600 }}>
                    <Section style={{ textAlign: "center", paddingBottom: 16 }}>
                        <Heading style={{ margin: 0, color: brandColor }}>{salonName}</Heading>
                        <Text style={{ margin: "8px 0 0 0", color: "#6b7280", fontSize: 14 }}>Waitlist confirmation</Text>
                    </Section>

                    <Section style={{ padding: "8px 0 0 0" }}>
                        <Heading style={{ fontSize: 20, margin: "8px 0", color: brandColor }}>
                            Hi {customerName},
                        </Heading>

                        <Text style={{ color: "#374151", fontSize: 16, lineHeight: 1.5 }}>
                            Thanks for your interest in {serviceName ?? "our services"} at {salonName}. You&apos;re on the waitlist — we&apos;ll notify you if a spot becomes available.
                        </Text>

                        <Section style={{ backgroundColor: "#f9fafb", borderRadius: 6, padding: 12, marginTop: 14 }}>
                            <Text style={{ fontWeight: 600, color: brandColor, margin: "0 0 8px 0" }}>Waitlist Details:</Text>

                            <Row>
                                <Column>
                                    {date && <Text style={{ margin: "4px 0", color: "#374151" }}>• Date: {date}</Text>}
                                    {time && <Text style={{ margin: "4px 0", color: "#374151" }}>• Time: {time}</Text>}
                                    {serviceName && <Text style={{ margin: "4px 0", color: "#374151" }}>• Service: {serviceName}</Text>}
                                    <Text style={{ margin: "4px 0", color: "#374151" }}>• Position: {position ?? "—"}</Text>
                                    {estimatedWait && <Text style={{ margin: "4px 0", color: "#374151" }}>• Estimated wait: {estimatedWait}</Text>}
                                </Column>
                            </Row>
                        </Section>

                        <Text style={{ color: "#374151", fontSize: 14, marginTop: 14 }}>
                            We will contact you at the email on file if a slot opens. If you need to update your preferences or cancel your waitlist entry, contact {contact ?? "the salon"}.
                        </Text>

                        {manageBookingUrl && (
                            <Section style={{ paddingTop: 12, textAlign: "center" }}>
                                <Button
                                    style={{ backgroundColor: accent, color: "#ffffff", borderRadius: 6, textDecoration: "none" }}
                                    href={manageBookingUrl}
                                >
                                    Manage waitlist
                                </Button>
                            </Section>
                        )}

                        <Text style={{ marginTop: 18, color: "#374151" }}>
                            Best,
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
