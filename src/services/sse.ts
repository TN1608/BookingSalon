let eventSource: EventSource | null = null;

export const openSSE = (appointmentId: string) => {
    if (eventSource) eventSource.close();

    eventSource = new EventSource(
        `http://localhost:8080/api/sse/appointments/${appointmentId}`
    );

    localStorage.setItem(`booking_${appointmentId}`, "confirmed");

    eventSource.addEventListener("appointment.update", (e) => {
        try {
            const data = JSON.parse(e.data);
            if (data.status === "confirmed") {
                eventSource?.close();
            }
        } catch (err) {}
    });

    eventSource.onerror = () => {
        console.error("SSE error");
        eventSource?.close();
    };
};