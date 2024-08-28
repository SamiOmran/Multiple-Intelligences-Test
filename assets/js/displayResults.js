// Listen for messages from the test submission page
window.addEventListener('updateResults', function (event) {
	if (event.data.type === 'updateResults') {
		displayResults(event.data.results);
	}
});

async function fetchResults() {
	try {
		let response = await fetch(
			'https://multiple-intelligences-test.vercel.app/api/results'
		);
		let results = await response.json();

		displayResults(results);
	} catch (error) {
		console.error('Error fetching results:', error);
		document.getElementById('resultsContainer').innerHTML =
			'<p>Error fetching results.</p>';
	}
}

function displayResults(results) {
	const resultsContainer = document.getElementById('results-container');
	resultsContainer.innerHTML = '';

	results.forEach((result, index) => {
		let table = `<table class="result-table">
						<tr class="name"><th colspan="2"> ${result.teacherName} </th></tr>
						<tr>
							<th>النتيجة</th>
							<th>الذكاء</th>
						</tr>`;

		for (let [key, value] of Object.entries(result.results)) {
			table += `<tr class="result-row">
						<td>${value}</td>
						<td>${key}</td>
					  </tr>`;
		}
		table += '</table>';
		resultsContainer.innerHTML += table;
	});
}

// Fetch results on page load
fetchResults();
