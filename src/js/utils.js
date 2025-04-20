/**
 * Utility functions for the Longevity Calculator
 */

/**
 * Saves calculation results to localStorage
 * @param {Object} data - Form data
 * @param {Object} results - Calculation results
 */
function saveResults(data, results) {
    // Create a result object with timestamp
    const resultEntry = {
        timestamp: new Date().toISOString(),
        inputs: data,
        results: results
    };
    
    // Get existing history or initialize new array
    let history = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    
    // Add new entry to beginning of array
    history.unshift(resultEntry);
    
    // Keep only the last 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save back to localStorage
    localStorage.setItem('calculationHistory', JSON.stringify(history));
}

/**
 * Gets calculation history from localStorage
 * @returns {Array} Array of previous calculation results
 */
function getCalculationHistory() {
    return JSON.parse(localStorage.getItem('calculationHistory') || '[]');
}

/**
 * Clears calculation history from localStorage
 */
function clearCalculationHistory() {
    localStorage.removeItem('calculationHistory');
}

/**
 * Formats a date as a readable string
 * @param {string} isoDateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

/**
 * Prints the current results
 */
function printResults() {
    // Create a print-friendly version
    const printContent = document.getElementById('results').cloneNode(true);
    
    // Add some styling for print
    const style = document.createElement('style');
    style.innerHTML = `
        body { font-family: Arial, sans-serif; color: #000; }
        .age-box { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
        .recommendation { margin-bottom: 10px; padding: 5px; border-left: 3px solid #333; }
        h1, h2, h3 { margin-bottom: 10px; }
        .chart-container { margin: 20px 0; }
        @media print {
            .no-print { display: none; }
        }
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Your Biological Age Results</title></head><body>');
    printWindow.document.write('<h1>Biological Age Calculator Results</h1>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.head.appendChild(style);
    
    // Remove any buttons or interactive elements from print view
    const noPrintElements = printWindow.document.querySelectorAll('button, .chart-container');
    noPrintElements.forEach(elem => {
        elem.classList.add('no-print');
    });
    
    // Wait for content to load and print
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}