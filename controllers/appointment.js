exports.createAppointment = async (req, res) => {
    try {
        const {customerId, stylistId, startTime, duration, notes, status, services, discountPercent} = req.body;


    } catch (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({error: 'Failed to create appointment'});
    }
};

exports.getAppointments = async (req, res) => {
};

exports.getAppointmentById = async (req, res) => {
};

exports.getAppointmentsByCustomerId = async (req, res) => {
};