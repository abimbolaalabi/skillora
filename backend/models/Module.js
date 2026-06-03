const mongoose = require('mongoose');


const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    },
    videoPublicId: {
        type: String
    },
    reflectionQuestion: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 5
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    }
}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
