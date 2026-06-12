import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Badge name is required"],
        trim: true,
    },

    description: {
        type: String,
        required: [true, "Badge description is required"],
        trim: true,
    },

    iconUrl: {
        type: String,
        required: [true, "Badge icon is required"],
        trim: true,
    },

    criteria: {
        type: String,
        required: [true, "Badge criteria is required"],
        
    },

    score: {
        type: Number,
        required: false,
        default: null, // Some badges are earned through criteria such as login streaks and do not require a score
        default: 50,
        min: [50, "Score cannot be less than 50"],
        max: [100, "Score cannot exceed 100"],
    },

    category: {
        type: String,
        required: [true, "Badge category is required"],
        lowercase: true,
        trim: true,
        enum: {
            values: [
                "attendance",
                "learning",
                "performance",
                "leadership",
            "special recognition",
            ],
        message: "Invalid badge category",
      },
    },

    isActive: {
        type: Boolean,
        default: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
        virtuals: true,
    },

    toObject: {
        virtuals: true,
    },
  }
);

// Badge level virtual
badgeSchema.virtual("level").get(function () {
if (this.score == null) return null;

if (this.score >= 95) return "platinum";
if (this.score >= 81) return "gold";
if (this.score >= 71) return "silver";

return "bronze";
});


export default mongoose.model("Badge", badgeSchema);