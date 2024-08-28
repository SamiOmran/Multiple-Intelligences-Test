const Result = require('./models/resultSchema');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(__dirname + '/assets'));

// Endpoint to store results
app.post('/api/results', async (req, res) => {
	const { teacherName, results } = req.body;

	try {
		const newResult = new Result({ teacherName, results });
		await newResult.save();
		res.status(201).json({ message: 'Results saved successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Server error' });
	}
});

// Endpoint to retrieve results by teacher name
app.get('/api/results/', async (req, res) => {
	const fields = { '_id': 0, 'teacherName': 1, 'results': 1 };

	try {
		const teacherResults = await Result.find().select(fields);
		res.status(200).json(teacherResults);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/results', (req, res) => {	
	res.sendFile(path.join(__dirname, './static/results.html'));
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
