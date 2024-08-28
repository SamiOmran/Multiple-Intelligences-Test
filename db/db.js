const mongoose = require('mongoose');

// Connect to MongoDB
mongoose
	.connect('mongodb://localhost:27017/intelligenceTest', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.log(err));

module.exports = mongoose