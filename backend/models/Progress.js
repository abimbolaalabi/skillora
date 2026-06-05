import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
    },

    // Video engagement
    videoWatched: { type: Boolean, default: false },
    videoProgressSeconds: { type: Number, default: 0 },
    watchedAt: { type: Date },

    // Quiz
    quizAttempted: { type: Boolean, default: false },
    quizScore: { type: Number, default: 0 },       // percentage 0-100
    quizPassedAt: { type: Date },

    // Reflection
    reflectionSubmitted: { type: Boolean, default: false },
    reflectionText: { type: String, default: "" },
    reflectionSubmittedAt: { type: Date },

    // Overall status
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "not_started",
    },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// One record per user per module
progressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);
