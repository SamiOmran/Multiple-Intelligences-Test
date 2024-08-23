// Load JSON file with the questions
fetch('questions.json')
    .then(response => response.json())
    .then(data => createFormSections(data))
    .catch(error => console.error('Error loading the JSON file:', error));

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

        // Add the questions as rows in the table
        questions[section].forEach((question, branchIndex) => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="radio" name="section${sectionIndex}_branch${branchIndex + 1}" value="0" checked required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${branchIndex + 1}" value="1" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${branchIndex + 1}" value="2" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${branchIndex + 1}" value="3" required></td>
                <td><input type="radio" name="section${sectionIndex}_branch${branchIndex + 1}" value="4" required></td>
                <td class="question">${question}</td>
            `;
            table.querySelector('tbody').appendChild(row);
        });

        sectionDiv.appendChild(table);
        formSections.appendChild(sectionDiv);
        sectionIndex++;
    }
}

// Function to handle form submission and display the results
document.getElementById('intelligenceForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let results = {};

    // Initialize the results object with keys for each branch
    for (let branch = 1; branch <= 6; branch++) {
        results[`Branch ${branch}`] = [];
    }

    // Aggregate the scores for each branch across all sections
    for (let [key, value] of formData.entries()) {
        let branchMatch = key.match(/branch(\d+)/);
        if (branchMatch) {
            let branch = `Branch ${branchMatch[1]}`;
            results[branch].push(parseInt(value));
        }
    }

    // Calculate the summation for each section
    let sectionSums = Array(10).fill(0);
    for (let branch in results) {
        results[branch].forEach((score, index) => {
            sectionSums[index] += score;
        });
    }

    const sections = ['أولًا', 'ثانيًا', 'ثالثًا', 'رابعًا', 'خامسًا', 'سادسًا', 'سابعًا', 'ثامنًا', 'تاسعًا', 'عاشرًا']
    // Display the results in a table
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<h3>Results</h3>';
    let table = '<table class="result-table"><tr><th>الذكاء</th>';
    
    // Adding section headers to the first row
    for (let i = 9; i >= 0; i--) {
        table += `<th>${sections[i]}</th>`;
    }
    table += '</tr>';

    // Adding branches in the first column and scores in subsequent columns
    for (let branch in results) {
        table += `<tr><td>${branch}</td>`;
        results[branch].forEach(score => {
            table += `<td>${score}</td>`;
        });
        table += '</tr>';
    }

    // Adding the summation row at the end
    table += '<tr class="sum-row"><td>المجموع</td>';
    sectionSums.forEach(sum => {
        table += `<td>${sum}</td>`;
    });
    table += '</tr>';

    table += '</table>';
    resultDiv.innerHTML += table;
});
