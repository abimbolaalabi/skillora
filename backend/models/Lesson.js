import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' }
}, { timestamps: true });

export default mongoose.model('Lesson', lessonSchema);