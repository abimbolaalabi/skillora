import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    iconUrl: {
        type: String,
        required: true,
        trim: true
    },
    criteria: {
        type: String,
        required: true,
        trim: true,
    },
    score: {
        type: Number,
        required: true,
        min: 50,
        max: 100
    },
    category: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum: [ 
            "attendance",
            "learning",
            "performance",
            "leadership",
            "special recognition"
        ],

    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true ,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    }
});

//virtual field to calculate badge level based on score
badgeSchema.virtual("level").get(function() {
    if (this.score >= 95) return "platinum";
    if (this.score >= 81) return "gold";
    if (this.score >= 71) return "silver";
    return "bronze";
});


export default mongoose.model('Badge', badgeSchema);