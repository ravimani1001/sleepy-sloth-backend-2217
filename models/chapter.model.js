
const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  chapter: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  yearWiseQuestionCount: {
    type: Map,
    of: Number,
    required: true
  },
  questionSolved: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    required: true
  },
  isWeakChapter: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });

chapterSchema.index({ chapter: 1, class: 1, subject: 1 }, { unique: true });


module.exports = mongoose.model('Chapter', chapterSchema);
