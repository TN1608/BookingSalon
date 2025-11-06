const clients = new Map();

function sendEvent(res, eventName, data) {
    console.log("sendEvent called:", { eventName, data }); // LOG SẼ XUẤT HIỆN

    const eventLine = `event: ${eventName}\n`;
    const dataLine = `data: ${JSON.stringify(data)}\n\n`;

    res.write(eventLine + dataLine);
    res.flush?.(); // QUAN TRỌNG: FLUSH NGAY
}

const connectSse = async (req, res) => {
    const id = req.params.id;
    console.log("SSE connect:", id);

    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    if (res.flushHeaders) res.flushHeaders();
    else res.writeHead(200);

    // Gửi retry + welcome
    sendEvent(res, 'connected', { message: 'SSE connected' });
    res.write('retry: 10000\n\n');
    res.flush?.();

    if (!clients.has(id)) clients.set(id, new Set());
    clients.get(id).add(res);

    req.on('close', () => {
        const set = clients.get(id);
        if (set) {
            set.delete(res);
            if (set.size === 0) clients.delete(id);
        }
    });
};

function notifyAppointmentUpdate(appointmentId, payload, event = 'appointment.update') {
    const set = clients.get(String(appointmentId));
    console.log("notifyAppointmentUpdate → ID:", appointmentId, payload);

    if (!set || set.size === 0) {
        console.log("No SSE clients connected for:", appointmentId);
        return;
    }

    for (const res of set) {
        try {
            sendEvent(res, event, payload); // GỌI HÀM CHUNG → LOG SẼ XUẤT HIỆN
        } catch (err) {
        }
    }
}
module.exports = {connectSse, notifyAppointmentUpdate};