/**
 * Unit tests for the Longevity Calculator
 * 
 * This is a simple test suite that can be run in a browser
 * For more comprehensive testing, consider using Jest or Mocha
 */

// Test data
const testCases = [
    {
        name: "Baseline case - Average values",
        input: {
            age: "30",
            gender: "male",
            smoker: "no",
            exercise: "occasional", 
            diet: "average",
            sleep: "optimal"
        },
        expected: {
            chronologicalAge: 30,
            biologicalAge: 26, // 30 - 2 (occasional exercise) - 2 (optimal sleep)
            difference: -4
        }
    },
    {
        name: "Worst case scenario",
        input: {
            age: "30",
            gender: "male",
            smoker: "yes",
            exercise: "none",
            diet: "poor",
            sleep: "less"
        },
        expected: {
            chronologicalAge: 30,
            biologicalAge: 47, // 30 + 10 (smoking) + 2 (no exercise) + 3 (poor diet) + 2 (poor sleep)
            difference: 17
        }
    },
    {
        name: "Best case scenario",
        input: {
            age: "30",
            gender: "female",
            smoker: "no",
            exercise: "regular",
            diet: "good",
            sleep: "optimal"
        },
        expected: {
            chronologicalAge: 30,
            biologicalAge: 20, // 30 - 5 (regular exercise) - 3 (good diet) - 2 (optimal sleep)
            difference: -10
        }
    },
    {
        name: "Edge case - Young age with bad habits",
        input: {
            age: "18",
            gender: "male",
            smoker: "yes",
            exercise: "none",
            diet: "poor",
            sleep: "less"
        },
        expected: {
            chronologicalAge: 18,
            biologicalAge: 35, // 18 + 10 (smoking) + 2 (no exercise) + 3 (poor diet) + 2 (poor sleep)
            difference: 17
        }
    },
    {
        name: "Edge case - Old age with good habits",
        input: {
            age: "90",
            gender: "female",
            smoker: "no",
            exercise: "regular",
            diet: "good",
            sleep: "optimal"
        },
        expected: {
            chronologicalAge: 90,
            biologicalAge: 80, // 90 - 5 (regular exercise) - 3 (good diet) - 2 (optimal sleep)
            difference: -10
        }
    }
];

// Run tests
function runTests() {
    let passCount = 0;
    let failCount = 0;
    
    const resultsContainer = document.getElementById('test-results');
    resultsContainer.innerHTML = '<h2>Test Results</h2>';
    
    testCases.forEach((testCase, index) => {
        // Run the calculation
        const result = calculateBiologicalAge(testCase.input);
        
        // Check if the result matches expected values
        const chronologicalAgeMatch = result.chronologicalAge === testCase.expected.chronologicalAge;
        const biologicalAgeMatch = result.biologicalAge === testCase.expected.biologicalAge;
        const differenceMatch = result.difference === testCase.expected.difference;
        const passed = chronologicalAgeMatch && biologicalAgeMatch && differenceMatch;
        
        // Update counts
        if (passed) {
            passCount++;
        } else {
            failCount++;
        }
        
        // Create result entry
        const resultEntry = document.createElement('div');
        resultEntry.className = passed ? 'test-pass' : 'test-fail';
        resultEntry.innerHTML = `
            <h3>Test ${index + 1}: ${testCase.name}</h3>
            <p><strong>Status:</strong> ${passed ? 'PASS ✅' : 'FAIL ❌'}</p>
            <details>
                <summary>View details</summary>
                <div class="test-details">
                    <h4>Input:</h4>
                    <pre>${JSON.stringify(testCase.input, null, 2)}</pre>
                    <h4>Expected:</h4>
                    <pre>${JSON.stringify(testCase.expected, null, 2)}</pre>
                    <h4>Actual:</h4>
                    <pre>${JSON.stringify({
                        chronologicalAge: result.chronologicalAge,
                        biologicalAge: result.biologicalAge,
                        difference: result.difference
                    }, null, 2)}</pre>
                </div>
            </details>
        `;
        
        resultsContainer.appendChild(resultEntry);
    });
    
    // Add summary
    const summary = document.createElement('div');
    summary.className = 'test-summary';
    summary.innerHTML = `
        <h3>Summary</h3>
        <p>Total tests: ${testCases.length}</p>
        <p>Passed: ${passCount}</p>
        <p>Failed: ${failCount}</p>
    `;
    
    resultsContainer.appendChild(summary);
    
    return {
        total: testCases.length,
        passed: passCount,
        failed: failCount
    };
}