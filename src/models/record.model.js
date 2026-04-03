// src/models/record.model.js
import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// ✅ ADD INDEXES HERE
recordSchema.index({ createdBy: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ date: -1 });
recordSchema.index({ type: 1 });

export default mongoose.model("Record", recordSchema);