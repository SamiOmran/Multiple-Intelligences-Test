const mongoose = require('../db/db');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
	teacherName: String,
	results: Map,
	submittedAt: { type: Date, default: Date.now },
});

// Create a model from the schema
module.exports = mongoose.model('Result', resultSchema);
