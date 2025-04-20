# Longevity Calculator

A web-based biological age calculator that estimates your biological age based on lifestyle factors and provides personalized health recommendations.

## Overview

This application allows users to input various lifestyle factors such as smoking status, exercise frequency, diet quality, and sleep patterns. Based on these inputs, it calculates an estimated biological age and provides personalized recommendations for improving health and potentially reducing biological age.

The calculations are based on simplified adjustments derived from research:
- Smoking: +10 years if smoker
- Exercise: -5 if regular (3-5 times/week), -2 if occasional (1-2 times/week), +2 if none
- Diet: -3 for good, 0 for average, +3 for poor
- Sleep: -2 for optimal (7-9 hours), +2 for suboptimal (<6 or >9 hours)

## Features

- Simple form-based input for lifestyle factors
- Comprehensive input validation
- Biological age calculation
- Visual representation of how each factor impacts biological age
- Personalized health recommendations based on inputs
- Result saving and history tracking
- Print functionality for results
- Mobile-responsive design

## Project Structure

```
LONGEVITY_CALCULATOR/
├── assets/
│   ├── images/
│   │   ├── logo.svg            # App logo for header
│   │   ├── exercise-icon.svg   # Icon for exercise section
│   │   ├── diet-icon.svg       # Icon for diet section
│   │   ├── sleep-icon.svg      # Icon for sleep section
│   │   ├── smoking-icon.svg    # Icon for smoking section
│   │   └── background.svg      # Background pattern
│   └── favicon.ico             # Browser tab icon
├── src/
│   ├── index.html              # Main HTML file
│   ├── js/
│   │   ├── calculator.js       # Biological age calculation logic
│   │   ├── recommendations.js  # Recommendation generation
│   │   ├── visualization.js    # Chart.js integration for data visualization
│   │   ├── validation.js       # Form validation functions
│   │   ├── utils.js            # Utility functions (storage, printing, etc.)
│   │   └── app.js              # Main application logic
│   └── css/
│       ├── styles.css          # Global styles (base elements, layout)
│       ├── form.css            # Form-specific styling
│       └── results.css         # Results display styling
├── tests/
│   ├── calculator.test.js      # Unit tests for calculation logic
│   └── test.html               # Browser-based test runner
├── README.md                   # Project documentation
└── package.json                # Project metadata and dependencies
```

# Integration Guide for Enhanced Longevity Calculator

This guide will help you integrate all the enhanced components to create your comprehensive biological age calculator.

## Files Overview

Here's a summary of the new and updated files:

### HTML
- **index.html**: Enhanced with tabbed form and additional input fields

### CSS
- **styles.css**: Global styles (keep existing)
- **form.css**: Enhanced with tab navigation and new form element styles
- **results.css**: Enhanced with category score display styles

### JavaScript
- **app.js**: Updated with tab navigation and comprehensive form data handling
- **calculator.js**: Enhanced with additional biological age factors and detailed calculation
- **recommendations.js**: Updated with more detailed personalized recommendations
- **visualization.js**: Enhanced with better charts and visualization options
- **validation.js**: Updated to validate all the new fields
- **utils.js**: Keep existing utility functions

## Integration Steps

Follow these steps to integrate all components:

1. **Update HTML First**
   - Replace your current `index.html` with the enhanced version
   - This will establish the structure for all other components

2. **Update CSS Files**
   - Replace your existing CSS files with the enhanced versions
   - Make sure all three CSS files (styles.css, form.css, results.css) are properly linked in HTML

3. **Update JavaScript Files**
   - Replace all JavaScript files with the enhanced versions
   - Make sure they're included in the HTML in the correct order:
     1. calculator.js
     2. recommendations.js
     3. visualization.js
     4. validation.js
     5. utils.js
     6. app.js (must be last)

4. **Update Assets**
   - Ensure the path to your logo.ico file is correct
   - Create necessary directory structure if it doesn't exist

5. **Test the Implementation**
   - Open index.html in a browser
   - Test tab navigation
   - Fill out form fields and submit
   - Verify results and visualizations display correctly

## Important Notes

### Path Updates
- If your folder structure differs from what's suggested, update all file paths in the HTML accordingly
- Pay special attention to asset paths like the logo

### Chart.js Dependency
- The enhanced calculator uses Chart.js
- Ensure the Chart.js script is properly loaded via CDN as indicated in the HTML

### Form Layout
- The form now uses a tabbed interface
- Navigation buttons (Previous/Next) manage tab switching
- The Calculate button only appears on the last tab

### Results Display
- Category scores are now displayed as percentage bars
- The factors chart now uses horizontal bars for better readability
- Recommendations are categorized by type and prioritized

## Troubleshooting

If you encounter issues:

1. **Check Console Errors**
   - Open browser developer tools (F12) and check for JavaScript errors

2. **Verify File Paths**
   - Ensure all CSS and JS files are correctly referenced

3. **Tab Navigation Issues**
   - If tabs don't work, check that app.js is properly loaded
   - Verify the tab button data-tab attributes match tab content IDs

4. **Chart Display Problems**
   - Confirm Chart.js is properly loaded
   - Check that the canvas elements have the correct IDs

5. **Form Submission Issues**
   - Verify that validation.js is working
   - Check that form data collection is capturing all fields

## Extending Further

You can further enhance the calculator by:

1. **Adding More Factors**
   - Add new input fields to appropriate tabs in HTML
   - Update calculator.js to include these factors in the calculation
   - Add corresponding recommendations in recommendations.js

2. **Improving Visualizations**
   - Consider adding a radar chart for category scores
   - Add a timeline chart for tracking progress over multiple calculations

3. **Enhancing User Experience**
   - Add animations for smoother transitions
   - Implement tooltips for explaining factors and recommendations

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- For development: basic text editor or IDE

### Installation

1. Clone or download this repository
2. No build steps or installation required! Open `src/index.html` in your browser to use the application

### Usage

1. Enter your age, gender, and lifestyle information in the form
2. Click "Calculate My Biological Age"
3. View your results, including:
   - Comparison between chronological and biological age
   - Visual breakdown of how each factor impacts your biological age
   - Personalized recommendations based on your inputs
4. Optionally print or save your results

## Project Organization

### CSS Structure

The project uses a modular CSS approach for better organization and maintainability:

- **styles.css**: Global styles including base elements, typography, layout, and utilities
- **form.css**: Styles specific to the input form, validation messages, and form elements
- **results.css**: Styles for the results display, charts, recommendations, and history

### JavaScript Organization

The JavaScript is organized into several modules, each with a specific responsibility:

- **app.js**: The central module that initializes the application and handles UI interactions
- **calculator.js**: Contains the biological age calculation algorithms
- **recommendations.js**: Generates personalized health recommendations
- **validation.js**: Handles form validation and error display
- **visualization.js**: Creates data visualizations with Chart.js
- **utils.js**: Provides utility functions for storage, date formatting, and printing

### Assets Management

The project includes a structured assets directory:

- **favicon.ico**: Browser tab icon
- **images/**: Contains all images used in the application, organized by purpose

## Testing

Open `tests/test.html` in your browser to run the unit tests for the calculation logic.

## Development

### Extending the Calculator

To add more factors to the biological age calculation:

1. Update the form in `index.html` to include new input fields
2. Add validation rules in `validation.js`
3. Modify `calculator.js` to include new factors in the calculation
4. Add corresponding recommendations in `recommendations.js`
5. Update tests in `calculator.test.js`

### Improving Visualizations

The visualization uses Chart.js. To modify or enhance:

1. Edit `visualization.js` to change chart types or options
2. Refer to [Chart.js documentation](https://www.chartjs.org/docs/latest/) for more chart types and configurations

## Limitations

This calculator provides an estimate based on simplified adjustments and should not be used as medical advice. The biological age concept is complex and affected by many more factors than those included in this model.

## Credits

- Chart.js for data visualization
- Research-based adjustments for biological age calculation

## License

This project is open source and available under the MIT License.