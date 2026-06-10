import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Course from "../models/Module.js";

// Create Certificate
export const createCertificate = async (req, res) => {
    try {
        const {
            employee,
            course,
            score,
            certificateUrl
        } = req.body;

        const employeeExists = await User.findById(employee);
        if (!employeeExists) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const courseExists = await Course.findById(course);
        if (!courseExists) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const certificate = await Certificate.create({
            employee,
            course,
            score,
            certificateUrl,
            certificateNumber: `CERT-${Date.now()}`
        });

        res.status(201).json({
            message: "Certificate created successfully",
            certificate
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Certificates
export const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate("employee", "name email")
            .populate("course", "title");

        res.status(200).json({
            count: certificates.length,
            certificates
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get Certificate By ID
export const getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id)
            .populate("employee", "name email")
            .populate("course", "title");

        if (!certificate) {
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        res.status(200).json(certificate);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update Certificate
export const updateCertificate = async (req, res) => {
    try {
        const {
            score,
            certificateUrl
        } = req.body;

        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            {
                score,
                certificateUrl
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedCertificate) {
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        res.status(200).json({
            message: "Certificate updated successfully",
            certificate: updatedCertificate
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Delete Certificate
export const deleteCertificate = async (req, res) => {
    try {
        const deletedCertificate = await Certificate.findByIdAndDelete(
            req.params.id
        );

        if (!deletedCertificate) {
            return res.status(404).json({
                message: "Certificate not found"
            });
        }

        res.status(200).json({
            message: "Certificate deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};