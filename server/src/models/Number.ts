import mongoose, { Schema } from "mongoose";
import { INumber } from "../types";

const numberSchema = new Schema<INumber>(
  {
    number: {
      type: String,
      required: [true, "Number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },
    status: {
      type: String,
      enum: ["Available", "Allocated", "Reserved", "Held", "Quarantined"],
      default: "Available",
    },
    serviceType: {
      type: String,
      enum: ["LTE", "IPTL", "FTTH/Copper"],
      required: [true, "Service type is required"],
    },
    specialType: {
      type: String,
      enum: ["Elite", "Gold", "Platinum", "Silver", "Standard"],
      default: "Standard",
    },
    allocatedTo: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [500, "Remarks cannot exceed 500 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update the updatedAt field before saving
numberSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Indexes for better query performance
numberSchema.index({ status: 1 });
numberSchema.index({ serviceType: 1 });
numberSchema.index({ specialType: 1 });
numberSchema.index({ createdAt: -1 });

export default mongoose.model<INumber>("Number", numberSchema);
