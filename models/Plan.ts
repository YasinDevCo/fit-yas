import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number }, // فقط برای بدنسازی
  note: { type: String },
});

const DaySchema = new mongoose.Schema({
  dayOfWeek: { type: Number, required: true }, // 0 = شنبه
  exercises: [ExerciseSchema]
});

const PlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, enum: ['calisthenics', 'bodybuilding'], required: true },
  days: [DaySchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
