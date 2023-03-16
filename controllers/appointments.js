const Appointment = require('../models/appointment');
const Hospital = require('../models/hospital');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Private

exports.getAppointments = async (req, res, next) => {
    let query;
    let hospitalId = req.params.hospitalId;
    
    if (hospitalId) {
        //General users can only see their appointments
        if (req.user.role !== 'Admin') {
            query = Appointment.find({user: req.user.id, hospital: hospitalId}).populate({
                path: 'hospital',
                select: 'name province tel'
            });
        } else {
            //If you are admin, you can see all
            query = Appointment.find({hospital: hospitalId}).populate({
                path: 'hospital',
                select: 'name province tel'
            });
        }
    } else {
        //General users can only see their appointments
        if (req.user.role !== 'Admin') {
            query = Appointment.find({user: req.user.id}).populate({
                path: 'hospital',
                select: 'name province tel'
            });
        } else {
            //If you are admin, you can see all
            query = Appointment.find().populate({
                path: 'hospital',
                select: 'name province tel'
            });
        }
    }

    try {
        const appointments = await query;

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, msg: "Cannot find Appointment"})
    }
}

//@desc     Get single appointment
//@route    GET /api/v1/appointments/:id
//@access   Public

exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'hospital',
            select: 'name description tel'
        });

        if (!appointment) {
            return res.status(404).json({success: false, msg: `No appointment with the id of  ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, msg: "Cannot find Appointment"});
    }
}

//@desc     Add appointment
//@route    POST /api/v1/appointments
//@access   Private
exports.addAppointment = async (req, res, next) => {
    try {
        req.body.hospital = req.params.hospitalId;

        const hospital = await Hospital.findById(req.params.hospitalId);

        if (!hospital) {
            return res.status(404).json({success: false, msg: `No hospital with the id of  ${req.params.id}`});
        }

        //add user id to req.body
        req.body.user = req.user.id;
        //Check for existed appointment
        const existedAppointments = await Appointment.find({user: req.user.id});
        //If the user is not an admin, they can only create 3 appointments
        if (existedAppointments.length >= 3 && req.user.role !== "admin") {
            return res.status(500).json({success: false, msg: `The user with ID ${req.user.id} has already made 3 appointments`});
        }


        const appointment = await Appointment.create(req.body);
        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, msg: "Cannot create Appointment"});
    }
}

//@desc     Update appointment
//@route    GET /api/v1/appointments/:id
//@access   Private
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        //Make sure user is the appointment owner
        if (appointment.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({success: false, msg: `User ${req.user.id} is not authorized to update this appointment`});
        }

        if (!appointment) {
            return res.status(404).json({success: false, msg: `No appointment with the id of  ${req.params.id}`});
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, msg: "Cannot update Appointment"});
    }
}

//@desc     Delete appointment
//@route    GET /api/v1/appointments/:id
//@access   Private
exports.deleteAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        //Make sure user is the appointment owner
        if (appointment.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({success: false, msg: `User ${req.user.id} is not authorized to delete this appointment`});
        }

        if (!appointment) {
            return res.status(404).json({success: false, msg: `No appointment with the id of  ${req.params.id}`});
        }

        await appointment.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({success: false, msg: "Cannot delete Appointment"});
    }
}