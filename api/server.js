const Result = require('../models/resultSchema');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');

let dirPath = __dirname;
dirPath = dirPath.substring(0, 39);
// console.log(dirPath);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/static', express.static(path.join(dirPath, '/static')));
app.use('/assets', express.static(path.join(dirPath, '/assets')));

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
	const fields = { _id: 0, teacherName: 1, results: 1 };

	try {
		const teacherResults = await Result.find().select(fields);
		res.status(200).json(teacherResults);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.get('/results', (req, res) => {
	res.sendFile(path.join(dirPath, '/static/results.html'));
});

app.get('/', (req, res) => {
	res.sendFile(path.join(dirPath, '/static/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(`Server is running on: https://localhost:${PORT}/`)
);
