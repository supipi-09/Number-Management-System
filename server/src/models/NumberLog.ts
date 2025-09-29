import mongoose, { Schema } from 'mongoose';
import { INumberLog } from '../types';

const numberLogSchema = new Schema<INumberLog>({
  number: {
    type: String,
    required: [true, 'Number is required'],
    trim: true
  },
  action: {
    type: String,
    enum: ['Allocated', 'Released', 'Reserved', 'Status Changed', 'Created'],
    required: [true, 'Action is required']
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Performed by user is required']
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  previousState: {
    type: Schema.Types.Mixed
  },
  newState: {
    type: Schema.Types.Mixed
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
numberLogSchema.index({ number: 1 });
numberLogSchema.index({ performedBy: 1 });
numberLogSchema.index({ timestamp: -1 });
numberLogSchema.index({ action: 1 });

export default mongoose.model<INumberLog>('NumberLog', numberLogSchema);