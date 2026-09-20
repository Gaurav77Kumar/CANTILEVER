import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true 
  },

  title: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 160 
  },

  description: { 
    type: String, 
    default: '', 
    maxlength: 4000 
  },

  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'completed'], 
    default: 'todo' 
  },

  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },

  dueDate: { 
    type: Date, 
    default: null 
  },

}, { 
  timestamps: true 
});

taskSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('Task', taskSchema);
