const clients = new Map();

function sendEvent(res, eventName, data) {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

const connectSse = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    })
    // flush cai headers va gan' data
    res.flushHeaders?.()
    res.write('retry: 10000\n\n')

    if(!clients.has(id)) clients.set(id, new Set());
    clients.get(id).add(res);

    // dong ket noi
    req.on('close', () => {
        const set = clients.get(id);
        if(!set) return;
        set.delete(res);
        if(set.size === 0) clients.delete(id);
    })


};


function notifyAppointmentUpdate(appointmentId, payload, event = 'appointment.update') {
    const set = clients.get(String(appointmentId));
    if (!set) return;
    for (const res of set) {
        try {
            sendEvent(res, event, payload);
        } catch (_) {
            // ignore per-client errors
        }
    }
}

module.exports = {connectSse, notifyAppointmentUpdate};