import Certificate from "../models/Certificate.js";
import cloudinary from "../config/cloudinary.js";


const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
        {
        folder: "certificate",
        },
        (error, result) => {
            if (error) return reject(error);
                resolve(result);
            }
    );

   stream.end(buffer);


    });
};



export const createCertificate = async (req, res) => {
try {

const {
    title,
    description,
    issuedTo,
    issuedBy,
    dateIssued,
    certificateNumber,
    type
} = req.body;


    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);
    if (!uploadResult || !uploadResult.secure_url) {
    return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
    });
}
    const CertificateNumber = `CERT-${Date.now()}`;
    const certificate = await Certificate.create({
        title,
        description,
        issuedTo,
        issuedBy,
        type,
        certificateNumber: CertificateNumber,
        certificateUrl: uploadResult.secure_url,
        dateIssued: dateIssued ? new Date(dateIssued) : Date.now(),
    });
    if (!certificate) {
    return res.status(500).json({
        success: false,
        message: "Failed to create certificate",
    });
}

    return res.status(201).json({
        success: true,
        message: "Certificate created successfully",
        data: certificate,
    });
} catch (error) {
    return res.status(400).json({
        success: false,
        message: error.message,
    });
}
};

export const getCertificates = async (req, res) => {
try {
const certificates = await Certificate.find().sort({ createdAt: -1 });  
    return res.status(200).json({
        success: true,
        count: certificates.length,
        data: certificates,
    }); 
} catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
    });
}};
export const getCertificateById = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await Certificate.findById(id);
            if (!certificate) {
                return res.status(404).json({
                    success: false,
                    message: "Certificate not found",
            });
        }

            return res.status(200).json({
                success: true,
                message: "Certificate fetched successfully",
                data: certificate,
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("UPDATE ID:", id); //To check
        console.log("UPDATE BODY:", req.body); //To check

        const updatedCertificate = await Certificate.findByIdAndUpdate(
            id,
            { $set: req.body },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedCertificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: updatedCertificate,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteCertificate = async (req, res) => {
    try {
        const { id } = req.params;
        const certificate = await Certificate.findById(id);
        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found",
            });
        }   
        await certificate.remove();

        return res.status(200).json({
            success: true,
            message: "Certificate deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    };  
};