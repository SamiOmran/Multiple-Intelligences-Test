// Load JSON file with the questions
fetch('questions.json')
	.then((response) => response.json())
	.then((data) => createFormSections(data))
	.catch((error) => console.error('Error loading the JSON file:', error));

// document
// 	.getElementById('startTestButton')
// 	.addEventListener('click', function () {
// 		let teacherName = document.getElementById('teacherName').value.trim();

// 		if (! teacherName) {
// 			alert('الرجاء إدخال الإسم حتى تبدئي الإمتحان.');
// 		} else {
// 			document.getElementById('sami').style.display = 'block';
// 			document.querySelector('.chart-container').style.display = 'block';
// 			document.querySelector('.teacher-name-container').style.display = 'none';
// 		}
// 	});

// Function to create the form sections and branches in a table format
function createFormSections(questions) {
	const formSections = document.getElementById('form-sections');
	let sectionIndex = 1;

	for (let section in questions) {
		let sectionDiv = document.createElement('div');
		sectionDiv.className = 'section';

		// Create the table for this section
		let table = document.createElement('table');
		table.className = 'question-table';
		table.innerHTML = `
            <thead>
                <tr>
                    <th>0</th>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                    <th id="section-number">${section}</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

		const indexes = ['أ', 'ب', 'ج', 'د', 'ه', 'و'];
		let i = 0;
		// Add the questions as rows in the table
		questions[section].forEach((question, branchIndex) => {
			let row = document.createElement('tr');
			row.innerHTML = `
                <td><input type="radio" name="section${sectionIndex}_branch${
				branchIndex + 1
			}" value="0" checked required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${
				branchIndex + 1
			}" value="1" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${
				branchIndex + 1
			}" value="2" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${
				branchIndex + 1
			}" value="3" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${
				branchIndex + 1
			}" value="4" required></td>
                <td class="question">${question}</td>
                <td class="indexing">${indexes[i]}</td>
            `;
			table.querySelector('tbody').appendChild(row);
			i++;
		});

		sectionDiv.appendChild(table);
		formSections.appendChild(sectionDiv);
		sectionIndex++;
	}
}

// Function to handle form submission and display the results
document
	.getElementById('intelligenceForm')
	.addEventListener('submit', function (e) {
		e.preventDefault();
		let form = e.target;
		let formData = new FormData(form);
		let results = {};
		const indexes = ['لغوي', 'رياضي منطقي', 'بصري', 'إيقاعي موسيقي', 'حركي', 'اجتماعي'];
		// Initialize the results object with keys for each branch
		for (let i = 0; i <= 5; i++) {
			results[indexes[i]] = [];
		}

		// Aggregate the scores for each branch across all sections
		for (let [key, value] of formData.entries()) {
			let branchMatch = key.match(/branch(\d+)/);
			if (branchMatch) {
				let branchIndex = parseInt(branchMatch[1]) - 1;
				let index = indexes[branchIndex];
				results[index].push(parseInt(value));
			}
		}

		// Calculate the summation for each branch
		let branchSums = {};
		for (let index in results) {
			branchSums[index] = results[index].reduce((acc, score) => acc + score, 0);
		}

		const sections = [
			'أولًا',
			'ثانيًا',
			'ثالثًا',
			'رابعًا',
			'خامسًا',
			'سادسًا',
			'سابعًا',
			'ثامنًا',
			'تاسعًا',
			'عاشرًا',
		];
		// Display the results in a table
		let resultDiv = document.getElementById('result');
		resultDiv.innerHTML = '<h1 class="result-heading">المجموع</h1>';
		let table = '<table class="result-table"><tr><th>الذكاء</th>';

		// Adding section headers to the first row
		for (let i = 0; i <= 9; i++) {
			table += `<th>${sections[i]}</th>`;
		}
		table += '<th id="sum-col">المجموع</th></tr>'; // Adding a Total column

		// Adding indexes in the first column and scores in subsequent columns
		for (let index in results) {
			table += `<tr><td>${index}</td>`;
			results[index].forEach((score) => {
				table += `<td>${score}</td>`;
			});
			table += `<td class="branch-sum">${branchSums[index]}</td></tr>`; // Adding the total sum for each branch
		}

		table += '</table>';
		resultDiv.innerHTML += table;

		// Create the Bar Chart
		let ctx = document.getElementById('resultsChart').getContext('2d');
		let chartStatus = Chart.getChart('resultsChart');

		if (chartStatus) {
			chartStatus.destroy();
		}

		let colors = [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)',
		];

		let borderColors = [
			'rgba(255, 99, 132, 1)',
			'rgba(54, 162, 235, 1)',
			'rgba(255, 206, 86, 1)',
			'rgba(75, 192, 192, 1)',
			'rgba(153, 102, 255, 1)',
			'rgba(255, 159, 64, 1)',
		];

		Chart.defaults.font.size = 17;
		Chart.defaults.font.weight = 'bold';
		Chart.defaults.font.lineHeight = 1.4;
		Chart.defaults.color = 'black'

		let chart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: Object.keys(branchSums),
				datasets: [
					{
						label: 'مؤشر الذكاء',
						data: Object.values(branchSums),
						backgroundColor: colors,
						borderColor: borderColors,
						borderWidth: 1.5,
					},
				],
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						max: 40,
					},
				},
			},
		});
	});
