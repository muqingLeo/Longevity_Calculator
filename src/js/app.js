/**
 * Main application logic for the Enhanced Biological Age Calculator
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results');
    const printButton = document.getElementById('print-results');
    const saveButton = document.getElementById('save-results');
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    
    // Tab navigation elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    
    let currentTabIndex = 0;
    
    // Initialize tab navigation
    initializeTabs();
    
    // Set up form validation
    if (typeof setupFormValidation === 'function') {
        setupFormValidation(form);
    }
    
    // Check for existing calculation history
    const history = getCalculationHistory();
    if (history.length > 0) {
        displayCalculationHistory(history);
    }
    
    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = collectFormData();
        
        // Validate inputs
        if (typeof validateForm === 'function') {
            const validationResult = validateForm(formData);
            
            if (!validationResult.valid) {
                displayValidationErrors(validationResult.errors);
                return;
            }
            
            // Clear any validation errors
            clearValidationErrors();
        }
        
        // Calculate biological age
        const calculationResults = calculateBiologicalAge(formData);
        
        // Generate recommendations
        const recommendations = generateRecommendations(formData, calculationResults);
        
        // Display results
        displayResults(calculationResults, recommendations);
    });
    
    // Print button handling
    if (printButton) {
        printButton.addEventListener('click', function() {
            printResults();
        });
    }
    
    // Save button handling
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const formData = collectFormData();
            
            const chronologicalAge = parseInt(document.getElementById('chronological-age').textContent);
            const biologicalAge = parseInt(document.getElementById('biological-age').textContent);
            const difference = biologicalAge - chronologicalAge;
            
            const results = {
                chronologicalAge: chronologicalAge,
                biologicalAge: biologicalAge,
                difference: difference,
                categoryScores: calculationResults ? calculationResults.categoryScores : null
            };
            
            saveResults(formData, results);
            
            // Update history display
            const history = getCalculationHistory();
            displayCalculationHistory(history);
            
            alert('Your results have been saved!');
        });
    }
    
    /**
     * Initializes tab navigation
     */
    function initializeTabs() {
        // Hide all tabs except the first one
        tabContents.forEach((content, index) => {
            if (index === 0) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Mark first tab button as active
        tabButtons.forEach((button, index) => {
            if (index === 0) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
            
            // Add click event to tab buttons
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        // Set initial button states
        updateNavigationButtons();
        
        // Add click events to navigation buttons
        prevButton.addEventListener('click', goToPreviousTab);
        nextButton.addEventListener('click', goToNextTab);
    }
    
    /**
     * Switches to a specific tab
     * @param {string} tabName - Name of the tab to switch to
     */
    function switchTab(tabName) {
        // Find tab index
        let tabIndex = 0;
        tabButtons.forEach((button, index) => {
            if (button.getAttribute('data-tab') === tabName) {
                tabIndex = index;
            }
        });
        
        // Update active tab
        tabButtons.forEach((button, index) => {
            if (index === tabIndex) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Show selected tab content
        tabContents.forEach((content, index) => {
            if (index === tabIndex) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update current tab index
        currentTabIndex = tabIndex;
        
        // Update navigation buttons
        updateNavigationButtons();
    }
    
    /**
     * Goes to the previous tab
     */
    function goToPreviousTab() {
        if (currentTabIndex > 0) {
            const prevTabName = tabButtons[currentTabIndex - 1].getAttribute('data-tab');
            switchTab(prevTabName);
        }
    }
    
    /**
     * Goes to the next tab
     */
    function goToNextTab() {
        if (currentTabIndex < tabButtons.length - 1) {
            const nextTabName = tabButtons[currentTabIndex + 1].getAttribute('data-tab');
            switchTab(nextTabName);
        }
    }
    
    /**
     * Updates navigation button states
     */
    function updateNavigationButtons() {
        // Enable/disable previous button
        prevButton.disabled = currentTabIndex === 0;
        
        // Show submit button on last tab, next button otherwise
        if (currentTabIndex === tabButtons.length - 1) {
            nextButton.style.display = 'none';
            submitButton.style.display = 'block';
        } else {
            nextButton.style.display = 'block';
            submitButton.style.display = 'none';
        }
    }
    
    /**
     * Collects all form data from inputs
     * @returns {Object} - Form data as key-value pairs
     */
    function collectFormData() {
        const formData = {};
        
        // Process text inputs and selects
        const inputs = form.querySelectorAll('input[type="text"], input[type="number"], select');
        inputs.forEach(input => {
            if (input.name) {
                formData[input.name] = input.value;
            }
        });
        
        // Process radio buttons
        const radioGroups = {};
        const radioButtons = form.querySelectorAll('input[type="radio"]:checked');
        radioButtons.forEach(radio => {
            if (radio.name) {
                formData[radio.name] = radio.value;
            }
        });
        
        // Process checkboxes (for multi-select)
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const checkboxValues = {};
        
        checkboxes.forEach(checkbox => {
            if (checkbox.name) {
                // Handle array notation in name (e.g., conditions[])
                const name = checkbox.name.replace('[]', '');
                
                if (!checkboxValues[name]) {
                    checkboxValues[name] = [];
                }
                
                checkboxValues[name].push(checkbox.value);
            }
        });
        
        // Add checkbox values to form data
        Object.keys(checkboxValues).forEach(key => {
            formData[key] = checkboxValues[key];
        });
        
        return formData;
    }
    
    /**
     * Displays calculation results and recommendations in the UI
     */
    function displayResults(results, recommendations) {
        // Update age displays
        document.getElementById('chronological-age').textContent = results.chronologicalAge;
        document.getElementById('biological-age').textContent = results.biologicalAge;
        
        // Update age difference text
        const ageDifferenceElem = document.getElementById('age-difference');
        const ageDifferenceTextElem = document.getElementById('age-difference-text');
        
        if (results.difference > 0) {
            ageDifferenceElem.textContent = results.difference + " years older than";
            ageDifferenceTextElem.className = "negative";
        } else if (results.difference < 0) {
            ageDifferenceElem.textContent = Math.abs(results.difference) + " years younger than";
            ageDifferenceTextElem.className = "positive";
        } else {
            ageDifferenceElem.textContent = "the same as";
            ageDifferenceTextElem.className = "neutral";
        }
        
        // Display category scores
        if (results.categoryScores) {
            updateCategoryScores(results.categoryScores);
        }
        
        // Create chart with factors
        if (typeof createFactorsChart === 'function' && results.factors && results.factors.length > 0) {
            createFactorsChart(results.factors, 'factors-chart');
        }
        
        // Display recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.className = `recommendation ${recommendation.priority}-priority`;
            li.innerHTML = `
                <div class="recommendation-category">${recommendation.category}</div>
                ${recommendation.text}
            `;
            recommendationsList.appendChild(li);
        });
        
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Save current calculation for later reference
        window.calculationResults = results;
    }
    
    /**
     * Updates the category score displays
     * @param {Object} categoryScores - Scores for each category
     */
    function updateCategoryScores(categoryScores) {
        // Update each category score display
        Object.keys(categoryScores).forEach(category => {
            const scoreData = categoryScores[category];
            const scoreValue = scoreData.percentageScore || 50; // Default to 50 if not provided
            
            // Update fill bar
            const fillElement = document.getElementById(`${category}-score-fill`);
            if (fillElement) {
                fillElement.style.width = `${scoreValue}%`;
                
                // Change color based on score
                if (scoreValue >= 70) {
                    fillElement.style.backgroundColor = '#27ae60'; // Green
                } else if (scoreValue >= 40) {
                    fillElement.style.backgroundColor = '#f39c12'; // Orange
                } else {
                    fillElement.style.backgroundColor = '#e74c3c'; // Red
                }
            }
            
            // Update score text
            const valueElement = document.getElementById(`${category}-score-value`);
            if (valueElement) {
                valueElement.textContent = `${Math.round(scoreValue)}%`;
            }
        });
    }
    
    /**
     * Displays calculation history in the UI
     */
    function displayCalculationHistory(history) {
        if (history.length === 0) {
            historyContainer.classList.add('hidden');
            return;
        }
        
        // Clear existing history
        historyList.innerHTML = '';
        
        // Create history entries
        history.forEach((entry, index) => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            
            // Create a color class based on the difference
            let resultClass = 'neutral';
            if (entry.results.difference < 0) {
                resultClass = 'positive';
            } else if (entry.results.difference > 0) {
                resultClass = 'negative';
            }
            
            historyEntry.innerHTML = `
                <div class="history-date">${formatDate(entry.timestamp)}</div>
                <div class="history-result ${resultClass}">
                    Biological Age: ${entry.results.biologicalAge}
                    (${entry.results.difference < 0 ? '-' : '+'}${Math.abs(entry.results.difference)} years)
                </div>
            `;
            
            // Add click event to load saved result
            historyEntry.addEventListener('click', () => {
                // Load the saved form data and results
                if (typeof loadSavedResult === 'function') {
                    loadSavedResult(entry.inputs, entry.results);
                } else {
                    alert('This feature is not yet implemented.');
                }
            });
            
            historyList.appendChild(historyEntry);
        });
        
        // Show history container
        historyContainer.classList.remove('hidden');
    }
});