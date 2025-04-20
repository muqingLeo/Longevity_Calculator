/**
 * Enhanced form validation for the Longevity Calculator
 */

/**
 * Validates the entire form data
 * @param {Object} data - Form data
 * @returns {Object} - Validation result with success flag and error messages
 */
function validateForm(data) {
    const errors = {};
    let isValid = true;
    
    // Required fields for each tab
    const requiredFields = {
        basic: ['age', 'gender'],
        diet: ['diet-quality'],
        activity: ['exercise'],
        lifestyle: ['sleep', 'smoker'],
        environment: ['outdoor-time'],
        medical: []
    };
    
    // Validate age
    const ageValidation = validateAge(data.age);
    if (!ageValidation.valid) {
        errors.age = ageValidation.message;
        isValid = false;
    }
    
    // Validate height and weight if provided
    if (data.height) {
        const heightValidation = validateHeight(data.height);
        if (!heightValidation.valid) {
            errors.height = heightValidation.message;
            isValid = false;
        }
    }
    
    if (data.weight) {
        const weightValidation = validateWeight(data.weight);
        if (!weightValidation.valid) {
            errors.weight = weightValidation.message;
            isValid = false;
        }
    }
    
    // Check required fields
    for (const category in requiredFields) {
        for (const field of requiredFields[category]) {
            if (!data[field] || data[field] === '') {
                errors[field] = `This field is required`;
                isValid = false;
            }
        }
    }
    
    return {
        valid: isValid,
        errors: errors
    };
}

/**
 * Validates the age input
 * @param {string|number} age - Age value
 * @returns {Object} - Validation result with valid flag and error message
 */
function validateAge(age) {
    // Check if age is present
    if (!age) {
        return {
            valid: false,
            message: 'Please enter your age.'
        };
    }
    
    // Parse age as integer
    const ageNum = parseInt(age);
    
    // Check if age is a number
    if (isNaN(ageNum)) {
        return {
            valid: false,
            message: 'Age must be a number.'
        };
    }
    
    // Check if age is within valid range (18-120)
    if (ageNum < 18) {
        return {
            valid: false,
            message: 'You must be at least 18 years old to use this calculator.'
        };
    }
    
    if (ageNum > 120) {
        return {
            valid: false,
            message: 'Please enter an age below 120.'
        };
    }
    
    // Age is valid
    return {
        valid: true
    };
}

/**
 * Validates the height input
 * @param {string|number} height - Height value in cm
 * @returns {Object} - Validation result with valid flag and error message
 */
function validateHeight(height) {
    // Parse height as integer
    const heightNum = parseInt(height);
    
    // Check if height is a number
    if (isNaN(heightNum)) {
        return {
            valid: false,
            message: 'Height must be a number.'
        };
    }
    
    // Check if height is within valid range (100-250 cm)
    if (heightNum < 100) {
        return {
            valid: false,
            message: 'Height seems too low. Please enter height in centimeters.'
        };
    }
    
    if (heightNum > 250) {
        return {
            valid: false,
            message: 'Height seems too high. Please enter height in centimeters.'
        };
    }
    
    // Height is valid
    return {
        valid: true
    };
}

/**
 * Validates the weight input
 * @param {string|number} weight - Weight value in kg
 * @returns {Object} - Validation result with valid flag and error message
 */
function validateWeight(weight) {
    // Parse weight as integer
    const weightNum = parseInt(weight);
    
    // Check if weight is a number
    if (isNaN(weightNum)) {
        return {
            valid: false,
            message: 'Weight must be a number.'
        };
    }
    
    // Check if weight is within valid range (30-300 kg)
    if (weightNum < 30) {
        return {
            valid: false,
            message: 'Weight seems too low. Please enter weight in kilograms.'
        };
    }
    
    if (weightNum > 300) {
        return {
            valid: false,
            message: 'Weight seems too high. Please enter weight in kilograms.'
        };
    }
    
    // Weight is valid
    return {
        valid: true
    };
}

/**
 * Displays validation errors in the UI
 * @param {Object} errors - Object containing error messages keyed by field names
 */
function displayValidationErrors(errors) {
    // Clear any existing error messages
    clearValidationErrors();
    
    // Add error messages for each field
    Object.keys(errors).forEach(field => {
        const inputElement = document.getElementById(field);
        if (inputElement) {
            // Add error class to input
            inputElement.classList.add('invalid');
            
            // Create and add error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = errors[field];
            
            // Insert error message after the input or its parent for radio buttons
            let parentElement = inputElement.parentNode;
            
            // Special handling for radio buttons
            if (field === 'smoker' || field === 'fasting' || field === 'blue-light') {
                parentElement = document.querySelector(`input[name="${field}"]`).closest('.form-group');
            }
            
            parentElement.appendChild(errorMessage);
            
            // Switch to tab containing the error
            const tabContent = inputElement.closest('.tab-content');
            if (tabContent) {
                const tabId = tabContent.id;
                const tabName = tabId.replace('-tab', '');
                const tabButton = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
                if (tabButton) {
                    tabButton.click();
                }
            }
        }
    });
}

/**
 * Clears all validation errors from the UI
 */
function clearValidationErrors() {
    // Remove error class from all inputs
    const invalidInputs = document.querySelectorAll('.invalid');
    invalidInputs.forEach(input => {
        input.classList.remove('invalid');
    });
    
    // Remove all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.remove();
    });
}

/**
 * Sets up real-time validation for form inputs
 * @param {HTMLFormElement} form - The form element
 */
function setupFormValidation(form) {
    // Add input event listeners to all inputs
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Clear error for this input
            this.classList.remove('invalid');
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    // Add special handling for age field
    const ageInput = form.querySelector('#age');
    if (ageInput) {
        ageInput.addEventListener('blur', function() {
            const validation = validateAge(this.value);
            if (!validation.valid) {
                this.classList.add('invalid');
                
                // Create and add error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = validation.message;
                this.parentNode.appendChild(errorMessage);
            }
        });
    }
    
    // Add special handling for height field
    const heightInput = form.querySelector('#height');
    if (heightInput) {
        heightInput.addEventListener('blur', function() {
            if (this.value) { // Only validate if a value is entered
                const validation = validateHeight(this.value);
                if (!validation.valid) {
                    this.classList.add('invalid');
                    
                    // Create and add error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = validation.message;
                    this.parentNode.appendChild(errorMessage);
                }
            }
        });
    }
    
    // Add special handling for weight field
    const weightInput = form.querySelector('#weight');
    if (weightInput) {
        weightInput.addEventListener('blur', function() {
            if (this.value) { // Only validate if a value is entered
                const validation = validateWeight(this.value);
                if (!validation.valid) {
                    this.classList.add('invalid');
                    
                    // Create and add error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = validation.message;
                    this.parentNode.appendChild(errorMessage);
                }
            }
        });
    }
}