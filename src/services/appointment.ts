type appointmentEmailProps = {
    to: string | undefined;
    name: string;
    date: string;
    time: string;
    serviceName: string;
    staffName: string;
}
export const sendAppointmentEmail = async ({to, name, date, time, serviceName, staffName}: appointmentEmailProps) => {
    try{
        await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ to, name, date, time, serviceName, staffName }),
        })
        return true;
    }catch (err) {
        console.error('Error sending email:', err);
        throw new Error('Failed to send email');
    }
}