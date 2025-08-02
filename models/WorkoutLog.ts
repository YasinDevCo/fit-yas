import mongoose from 'mongoose';

const WorkoutExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  setsDone: { type: Number, required: true },
  repsDone: { type: Number, required: true },
  weightUsed: Number,
  note: String,
  difficulty: { type: Number, min: 1, max: 10 } // نمره سختی اختیاری
});

const WorkoutLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  date: { type: Date, required: true },
  exercises: [WorkoutExerciseSchema]
}, { timestamps: true });

export default mongoose.models.WorkoutLog || mongoose.model('WorkoutLog', WorkoutLogSchema);
