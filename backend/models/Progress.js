import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    moduleId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Module',
        required: true
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
    },
    completionStatus: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    },
    completedLessons: [{
        lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson"
        },
        completedAt: {
        type: Date,
        default: Date.now
        }
    }],
    totalLessons: {
        type: Number,
        ref: "Lesson",
        default: 0
    },
    startedAt: {
        type: Date
     },
    completedAt: {
        type: Date
    }
}, { timestamps: true });

 // Virtual field to get completed lessons count
progressSchema.virtual('completedLessonsCount').get(function() {
  return this.completedLessons.length;
});

// Virtual field to get progress percentage
progressSchema.virtual('progressPercentage').get(function() {
  if (this.totalLessons === 0) return 0;
  return (this.completedLessons.length / this.totalLessons) * 100;
});

// Auto-update completionStatus based on lesson progress
progressSchema.pre('save', function(next) {
  if (this.startedAt && this.completionStatus === "Not Started") {
    this.completionStatus = "In Progress";
  }
 if (this.totalLessons > 0 && 
      this.completedLessons.length === this.totalLessons &&
      this.completionStatus !== "Completed") {
    this.completionStatus = "Completed";
    this.completedAt = this.completedAt || new Date();
  }
  next();
});



export default mongoose.model("Progress", progressSchema);
