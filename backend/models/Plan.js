const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subjects:      { type: String, required: true },
    examDate:      { type: String, required: true },
    hoursPerDay:   { type: Number, required: true },
    generatedPlan: { type: String, required: true },
    progress:      { type: Number, default: 0, min: 0, max: 100 },
    isCompleted:   { type: Boolean, default: false },
    notes:         { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
