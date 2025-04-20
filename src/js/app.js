/**
 * Enhanced main application logic for the Longevity Calculator
 * Integrates advanced AI features, visualization, and mental health assessment
 */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const resultsSection = document.getElementById('results');
    const printButton = document.getElementById('print-results');
    const saveButton = document.getElementById('save-results');
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    const startAssessmentBtn = document.getElementById('start-assessment-btn');
    
    // Tab navigation elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const prevButton = document.getElementById('prev-btn');
    const nextButton = document.getElementById('next-btn');
    const submitButton = document.getElementById('submit-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentTabIndex = 0;
    let calculationResults = null; // Store calculation results globally
    const totalTabs = tabButtons.length;
    
    // Start Assessment button handling
    if (startAssessmentBtn) {
        startAssessmentBtn.addEventListener('click', function() {
            // Show the calculator form with animation
            form.classList.remove('hidden');
            
            // Allow time for display:none to be removed before adding the visible class for animation
            setTimeout(() => {
                form.classList.add('visible');
                
                // Scroll to the form
                form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            
            // Optional: Update hero section to indicate assessment has started
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.classList.add('assessment-started');
                
                // Optionally change the button text
                startAssessmentBtn.textContent = 'Continue Your Assessment';
                
                // Optional: Add a small indicator that the form is below
                const indicator = document.createElement('div');
                indicator.className = 'scroll-indicator';
                indicator.innerHTML = '<span>↓</span>';
                heroSection.appendChild(indicator);
            }
        });
    }
    
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
        calculationResults = calculateBiologicalAge(formData);
        
        // Generate health trajectory prediction
        const trajectoryResults = predictHealthTrajectory(formData);
        
        // Generate recommendations
        const recommendations = generateRecommendations(formData, calculationResults);
        
        // Display results
        displayResults(calculationResults, recommendations, trajectoryResults);
    });
    
    // Event listeners for interactive elements
    if (document.getElementById('intervention-simulator')) {
        document.getElementById('intervention-simulator').addEventListener('submit', function(e) {
            e.preventDefault();
            simulateInterventions();
        });
    }
    
    // Print button handling
    if (printButton) {
        printButton.addEventListener('click', function() {
            printResults();
        });
    }
    
    // Save button handling
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCurrentResults();
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
                content.style.display = 'block';
                
                // Trigger entrance animation
                setTimeout(() => {
                    content.style.opacity = '1';
                }, 50);
            } else {
                content.classList.remove('active');
                content.style.opacity = '0';
                
                // Hide after animation completes
                setTimeout(() => {
                    if (!content.classList.contains('active')) {
                        content.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        // Update current tab index
        currentTabIndex = tabIndex;
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Update progress steps
        progressSteps.forEach((step, i) => {
            step.classList.toggle('active', i <= tabIndex);
        });
        
        // Update progress bar fill
        const progressPercentage = ((tabIndex + 1) / totalTabs) * 100;
        progressFill.style.width = `${progressPercentage}%`;
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
        if (validateCurrentTab()) {
            if (currentTabIndex < totalTabs - 1) {
                const nextTabName = tabButtons[currentTabIndex + 1].getAttribute('data-tab');
                switchTab(nextTabName);
            } else {
                // On last tab, submit the form
                form.dispatchEvent(new Event('submit'));
            }
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
     * with enhanced visualization and interactive elements
     * @param {Object} results - Calculation results
     * @param {Array} recommendations - Personalized recommendations
     * @param {Object} trajectoryData - Health trajectory predictions
     */
    function displayResults(results, recommendations, trajectoryData) {
        // Update age displays
        document.getElementById('chronological-age').textContent = results.chronologicalAge;
        document.getElementById('biological-age').textContent = results.biologicalAge;
        
        // Add confidence interval if available
        if (results.confidenceInterval) {
            const confidenceElem = document.getElementById('confidence-interval');
            if (confidenceElem) {
                confidenceElem.textContent = `±${Math.round(results.confidenceInterval)} years`;
            }
        }
        
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
        
        // Create visualizations
        if (results.factors && results.factors.length > 0) {
            // Impact factors chart
            if (typeof createFactorsChart === 'function') {
                createFactorsChart(results.factors, 'factors-chart');
            }
            
            // Category radar chart
            if (typeof createCategoryRadarChart === 'function' && document.getElementById('category-radar-chart')) {
                createCategoryRadarChart(results.categoryScores, 'category-radar-chart');
            }
            
            // Body map visualization
            if (typeof createBodyMapVisualization === 'function' && document.getElementById('body-map-container')) {
                createBodyMapVisualization(results.factors, 'body-map-container');
            }
            
            // Health trajectory projection chart
            if (typeof createTrajectoryChart === 'function' && document.getElementById('trajectory-chart')) {
                createTrajectoryChart(trajectoryData, 'trajectory-chart');
            }
        }
        
        // Display recommendations
        const recommendationsList = document.getElementById('recommendations-list');
        recommendationsList.innerHTML = '';
        
        recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.className = `recommendation ${recommendation.priority}-priority`;
            
            // Add evidence rating if available
            let evidenceTag = '';
            if (recommendation.evidenceRating) {
                evidenceTag = `<span class="evidence-tag ${recommendation.evidenceRating}-evidence">
                    ${recommendation.evidenceRating.charAt(0).toUpperCase() + recommendation.evidenceRating.slice(1)} Evidence
                </span>`;
            }
            
            // Add time to effect if available
            let timeTag = '';
            if (recommendation.timeToEffect) {
                timeTag = `<span class="time-tag ${recommendation.timeToEffect}">
                    ${recommendation.timeToEffect.replace('-', ' ')}
                </span>`;
            }
            
            li.innerHTML = `
                <div class="recommendation-header">
                    <div class="recommendation-category">${recommendation.category}</div>
                    ${evidenceTag}
                    ${timeTag}
                </div>
                <div class="recommendation-text">${recommendation.text}</div>
            `;
            
            recommendationsList.appendChild(li);
        });
        
        // Show results section
        resultsSection.classList.remove('hidden');
        
        // Animate results appearance
        const resultElements = resultsSection.querySelectorAll('.age-box, .chart-container, .category-scores, .recommendations');
        resultElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * index);
        });
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Save current calculation for later reference
        window.calculationResults = results;
    }
    
    /**
     * Updates the category score displays with animated progress bars
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
                // Start with width 0
                fillElement.style.width = '0%';
                
                // After a brief delay, animate to the actual value
                setTimeout(() => {
                    // Change color based on score
                    if (scoreValue >= 70) {
                        fillElement.style.backgroundColor = '#27ae60'; // Green
                    } else if (scoreValue >= 40) {
                        fillElement.style.backgroundColor = '#f39c12'; // Orange
                    } else {
                        fillElement.style.backgroundColor = '#e74c3c'; // Red
                    }
                    
                    // Animate the width
                    fillElement.style.width = `${scoreValue}%`;
                }, 100);
            }
            
            // Update score text
            const valueElement = document.getElementById(`${category}-score-value`);
            if (valueElement) {
                // Use a counter animation for the text
                const targetValue = Math.round(scoreValue);
                let currentValue = 0;
                const duration = 1500; // ms
                const increment = targetValue / (duration / 16); // 60fps
                
                const updateCounter = () => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        currentValue = targetValue;
                        clearInterval(counterInterval);
                    }
                    valueElement.textContent = `${Math.round(currentValue)}%`;
                };
                
                const counterInterval = setInterval(updateCounter, 16);
            }
        });
    }
    
    /**
     * Simulates the impact of selected interventions on biological age
     */
    function simulateInterventions() {
        // Get current form data
        const currentData = collectFormData();
        
        // Get selected interventions
        const interventions = [];
        const interventionSelects = document.querySelectorAll('.intervention-select');
        
        interventionSelects.forEach(select => {
            if (select.value && select.value !== 'none') {
                const factor = select.getAttribute('data-factor');
                interventions.push({
                    factor: factor,
                    value: select.value
                });
            }
        });
        
        // If no interventions selected, show message
        if (interventions.length === 0) {
            alert('Please select at least one intervention to simulate.');
            return;
        }
        
        // Create modified data with interventions
        const modifiedData = {...currentData};
        interventions.forEach(intervention => {
            modifiedData[intervention.factor] = intervention.value;
        });
        
        // Calculate new biological age
        const newResults = calculateBiologicalAge(modifiedData);
        
        // Display comparison
        const comparisonContainer = document.getElementById('intervention-results');
        if (comparisonContainer) {
            comparisonContainer.innerHTML = `
                <div class="intervention-comparison">
                    <div class="comparison-item">
                        <h4>Current Biological Age</h4>
                        <p class="comparison-value">${calculationResults.biologicalAge}</p>
                    </div>
                    <div class="comparison-arrow">→</div>
                    <div class="comparison-item">
                        <h4>Potential Biological Age</h4>
                        <p class="comparison-value ${newResults.biologicalAge < calculationResults.biologicalAge ? 'positive' : 'negative'}">${newResults.biologicalAge}</p>
                    </div>
                    <div class="comparison-difference">
                        <p>Potential improvement: <span class="positive">${Math.max(0, calculationResults.biologicalAge - newResults.biologicalAge)} years</span></p>
                    </div>
                </div>
            `;
            
            comparisonContainer.style.display = 'block';
        }
    }
    
    /**
     * Saves current calculation results
     */
    function saveCurrentResults() {
        if (!calculationResults) return;
        
        const formData = collectFormData();
        
        const results = {
            chronologicalAge: calculationResults.chronologicalAge,
            biologicalAge: calculationResults.biologicalAge,
            difference: calculationResults.difference,
            categoryScores: calculationResults.categoryScores
        };
        
        saveResults(formData, results);
        
        // Update history display
        const history = getCalculationHistory();
        displayCalculationHistory(history);
        
        // Show confirmation message
        const saveConfirmation = document.createElement('div');
        saveConfirmation.className = 'save-confirmation';
        saveConfirmation.textContent = 'Your results have been saved!';
        document.body.appendChild(saveConfirmation);
        
        // Fade out and remove after animation
        setTimeout(() => {
            saveConfirmation.style.opacity = '0';
            setTimeout(() => {
                saveConfirmation.remove();
            }, 500);
        }, 2000);
    }
    
    /**
     * Displays calculation history in the UI
     * @param {Array} history - Array of saved calculation entries
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
                <button class="history-load-btn">Load</button>
            `;
            
            // Add click event to load saved result
            const loadButton = historyEntry.querySelector('.history-load-btn');
            loadButton.addEventListener('click', () => {
                loadSavedResult(entry.inputs, entry.results);
            });
            
            historyList.appendChild(historyEntry);
        });
        
        // Show history container
        historyContainer.classList.remove('hidden');
    }
    
    /**
     * Loads a saved result into the form and displays it
     * @param {Object} inputs - Saved form inputs
     * @param {Object} results - Saved calculation results
     */
    function loadSavedResult(inputs, results) {
        // Fill form with saved inputs
        fillFormWithData(inputs);
        
        // Display results
        calculationResults = results;
        displayResults(results, generateRecommendations(inputs, results));
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Fills the form with saved data
     * @param {Object} data - Form data to populate
     */
    function fillFormWithData(data) {
        // Fill text inputs and selects
        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    // Handle checkbox and radio inputs separately
                    if (Array.isArray(data[key])) {
                        // For arrays (checkboxes)
                        data[key].forEach(value => {
                            const checkbox = document.querySelector(`[name="${key}[]"][value="${value}"]`);
                            if (checkbox) checkbox.checked = true;
                        });
                    } else {
                        // For single values (radio buttons)
                        const radio = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
                        if (radio) radio.checked = true;
                    }
                } else {
                    // For text inputs and selects
                    input.value = data[key];
                }
            }
        });
    }
    
    // Validate current tab fields
    function validateCurrentTab() {
        const currentTab = tabContents[currentTabIndex];
        const requiredFields = currentTab.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            // Remove previous validation messages
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            field.classList.remove('invalid');
            
            // Check if the field is empty
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                
                // Add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'This field is required';
                field.parentNode.appendChild(errorMessage);
            }
        });
        
        if (!isValid && window.innerWidth < 768) {
            // Scroll to the first invalid field on mobile
            const firstInvalidField = currentTab.querySelector('.invalid');
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        return isValid;
    }
    
    // Validate the entire form
    function validateForm() {
        let isValid = true;
        
        // Check each tab for required fields
        tabContents.forEach((tabContent, index) => {
            const requiredFields = tabContent.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    // Switch to the first tab with invalid fields
                    if (index !== currentTabIndex) {
                        setActiveTab(index);
                        return;
                    }
                }
            });
            
            // Stop checking further tabs if we found an invalid one
            if (!isValid) {
                return;
            }
        });
        
        if (!isValid) {
            validateCurrentTab(); // This will mark the fields as invalid
        }
        
        return isValid;
    }
    
    // Initialize tooltips for mobile (tap to show)
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');
    tooltipIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            // Toggle visibility of this tooltip
            const tooltip = this.querySelector('.tooltip-content');
            tooltip.style.opacity = tooltip.style.opacity === '1' ? '0' : '1';
            tooltip.style.visibility = tooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
            
            // Hide all other tooltips
            document.querySelectorAll('.tooltip-content').forEach(t => {
                if (t !== tooltip) {
                    t.style.opacity = '0';
                    t.style.visibility = 'hidden';
                }
            });
        });
    });
    
    // Hide tooltips when clicking elsewhere
    document.addEventListener('click', function() {
        document.querySelectorAll('.tooltip-content').forEach(tooltip => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
    
    // Initialize the first tab
    switchTab(tabButtons[0].getAttribute('data-tab'));
    
    // Load history if available
    loadCalculationHistory();
    
    // Load calculation history
    function loadCalculationHistory() {
        const history = getCalculationHistory();
        if (history.length > 0) {
            document.getElementById('history-container').classList.remove('hidden');
        }
        updateHistoryDisplay();
    }
    
    // Update history display
    function updateHistoryDisplay() {
        const historyList = document.getElementById('history-list');
        const history = getCalculationHistory();
        
        if (!historyList || history.length === 0) return;
        
        historyList.innerHTML = '';
        
        history.forEach((entry, index) => {
            const historyEntry = document.createElement('div');
            historyEntry.className = 'history-entry';
            
            const entryContent = document.createElement('div');
            entryContent.className = 'history-entry-content';
            
            const date = document.createElement('div');
            date.className = 'history-date';
            date.textContent = formatDate(entry.timestamp);
            
            const ages = document.createElement('div');
            ages.className = 'history-ages';
            
            const chronoAge = document.createElement('div');
            chronoAge.className = 'history-chrono-age';
            chronoAge.innerHTML = `<span class="history-label">Chronological</span><span class="history-value">${entry.results.chronologicalAge}</span>`;
            
            const bioAge = document.createElement('div');
            bioAge.className = 'history-bio-age';
            bioAge.innerHTML = `<span class="history-label">Biological</span><span class="history-value">${entry.results.biologicalAge}</span>`;
            
            ages.appendChild(chronoAge);
            ages.appendChild(bioAge);
            
            entryContent.appendChild(date);
            entryContent.appendChild(ages);
            
            const actions = document.createElement('div');
            actions.className = 'history-actions';
            
            const viewBtn = document.createElement('button');
            viewBtn.className = 'history-action-btn';
            viewBtn.textContent = 'View';
            viewBtn.addEventListener('click', () => {
                // Display past result
                displayResults(entry.results, []);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'history-action-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                // Remove this entry from history
                const updatedHistory = history.filter((_, i) => i !== index);
                localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
                updateHistoryDisplay();
                
                // Hide history container if empty
                if (updatedHistory.length === 0) {
                    document.getElementById('history-container').classList.add('hidden');
                }
            });
            
            actions.appendChild(viewBtn);
            actions.appendChild(deleteBtn);
            
            historyEntry.appendChild(entryContent);
            historyEntry.appendChild(actions);
            
            historyList.appendChild(historyEntry);
        });
    }
    
    // Set up print and save buttons
    function setupActionButtons() {
        const printBtn = document.getElementById('print-results');
        const saveBtn = document.getElementById('save-results');
        const shareBtn = document.getElementById('share-results');
        
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                printResults();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                // Already saved in local storage, show confirmation
                alert('Your results have been saved and will be available when you return to the calculator.');
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', function() {
                // Implement sharing functionality (e.g., copy link, social share)
                const shareData = {
                    title: 'My Biological Age Results',
                    text: 'Check out my results from the Advanced Biological Age Calculator!',
                    url: window.location.href
                };
                
                if (navigator.share) {
                    navigator.share(shareData)
                        .catch((error) => console.log('Error sharing', error));
                } else {
                    // Fallback for browsers that don't support Web Share API
                    prompt('Copy this link to share your calculator:', window.location.href);
                }
            });
        }
    }
    
    // Initialize the application
    setupActionButtons();
});

// Add CSS animation for save confirmation
const style = document.createElement('style');
style.textContent = `
.save-confirmation {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #27ae60;
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    opacity: 1;
    transition: opacity 0.5s ease;
}

.evidence-tag, .time-tag {
    font-size: 0.75rem;
    padding: 3px 8px;
    border-radius: 12px;
    margin-left: 10px;
}

.evidence-tag.strong-evidence {
    background-color: #d4edda;
    color: #155724;
}

.evidence-tag.moderate-evidence {
    background-color: #fff3cd;
    color: #856404;
}

.evidence-tag.emerging-evidence {
    background-color: #f8d7da;
    color: #721c24;
}

.time-tag.short-term {
    background-color: #cce5ff;
    color: #004085;
}

.time-tag.medium-term {
    background-color: #d1ecf1;
    color: #0c5460;
}

.time-tag.long-term {
    background-color: #e2e3e5;
    color: #383d41;
}

.recommendation-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.intervention-comparison {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    flex-wrap: wrap;
}

.comparison-item {
    text-align: center;
    padding: 10px 20px;
}

.comparison-value {
    font-size: 2rem;
    font-weight: bold;
}

.comparison-arrow {
    font-size: 2rem;
    margin: 0 20px;
    color: #7f8c8d;
}

.comparison-difference {
    width: 100%;
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.history-load-btn {
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.history-load-btn:hover {
    background-color: #2980b9;
}

@media (max-width: 768px) {
    .intervention-comparison {
        flex-direction: column;
    }
    
    .comparison-arrow {
        transform: rotate(90deg);
        margin: 15px 0;
    }
}
`;
document.head.appendChild(style);