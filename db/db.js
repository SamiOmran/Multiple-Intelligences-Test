const mongoose = require('mongoose');
require('dotenv').config()

const uri = process.env.MONGO_URI

// Connect to MongoDB
mongoose
	// .connect('mongodb://localhost:27017/intelligenceTest', {
	.connect(uri, {
		// useNewUrlParser: true,
		// useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

module.exports = mongoose