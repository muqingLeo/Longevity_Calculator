/**
 * Enhanced visualizations for the Longevity Calculator
 * Uses Chart.js to create detailed visualizations of biological age factors
 */

/**
 * Creates a chart showing the impact of each factor on biological age
 * @param {Array} factors - Array of factor objects with name and impact
 * @param {string} canvasId - ID of the canvas element to render the chart in
 */
function createFactorsChart(factors, canvasId) {
    // Check if canvas exists
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    // Sort factors by impact (most beneficial to most harmful)
    factors.sort((a, b) => a.impact - b.impact);
    
    // Group small factors into "Other" categories to avoid cluttered chart
    // Use separate groups for positive and negative impacts
    const significantFactors = [];
    let otherPositive = 0;
    let otherNegative = 0;
    
    factors.forEach(factor => {
        if (factor.impact >= 2 || factor.impact <= -2) {
            // Significant factor, keep individually
            significantFactors.push(factor);
        } else if (factor.impact > 0) {
            // Small negative factor
            otherNegative += factor.impact;
        } else if (factor.impact < 0) {
            // Small positive factor
            otherPositive += factor.impact;
        }
    });
    
    // Add other categories if they contain factors
    if (otherPositive !== 0) {
        significantFactors.push({
            name: 'Other Beneficial Factors',
            impact: otherPositive,
            description: 'Combined impact of smaller beneficial factors'
        });
    }
    
    if (otherNegative !== 0) {
        significantFactors.push({
            name: 'Other Risk Factors',
            impact: otherNegative,
            description: 'Combined impact of smaller risk factors'
        });
    }
    
    // Prepare data for the chart
    const labels = significantFactors.map(factor => factor.name);
    const impacts = significantFactors.map(factor => factor.impact);
    
    // Create visually distinct colors for positive and negative values
    const backgroundColors = impacts.map(impact => {
        if (impact < 0) {
            // Beneficial factors (green)
            return 'rgba(39, 174, 96, 0.8)';
        } else {
            // Risk factors (red)
            return 'rgba(231, 76, 60, 0.8)';
        }
    });
    
    const borderColors = impacts.map(impact => {
        if (impact < 0) {
            return 'rgba(39, 174, 96, 1)';
        } else {
            return 'rgba(231, 76, 60, 1)';
        }
    });
    
    // Destroy existing chart if it exists
    if (window.factorsChart) {
        window.factorsChart.destroy();
    }
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    window.factorsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Impact on Biological Age (Years)',
                data: impacts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  // Make it a horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const impact = context.raw;
                            const factor = significantFactors[context.dataIndex];
                            let label = '';
                            
                            if (impact < 0) {
                                label = `Reduces biological age by ${Math.abs(impact)} years`;
                            } else {
                                label = `Adds ${impact} years to biological age`;
                            }
                            
                            if (factor && factor.description) {
                                label += `\n${factor.description}`;
                            }
                            
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    title: {
                        display: true,
                        text: 'Years Impact on Biological Age',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
    
    // Adjust canvas height based on number of factors
    const height = Math.max(400, 50 * significantFactors.length);
    canvas.parentNode.style.height = `${height}px`;
}

/**
 * Creates a radar chart showing category scores
 * @param {Object} categoryScores - Object containing scores for each category
 * @param {string} canvasId - ID of the canvas element to render the chart in
 */
function createCategoryRadarChart(categoryScores, canvasId) {
    // Check if canvas exists
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    // Prepare data for the radar chart
    const categories = Object.keys(categoryScores);
    const scores = categories.map(cat => {
        // Convert percentage scores to 0-10 scale
        return categoryScores[cat].percentageScore / 10;
    });
    
    // User-friendly category names
    const categoryLabels = {
        'basic': 'Basic Health',
        'diet': 'Diet & Nutrition',
        'activity': 'Physical Activity',
        'lifestyle': 'Lifestyle',
        'environment': 'Environment',
        'medical': 'Medical'
    };
    
    const labels = categories.map(cat => categoryLabels[cat] || cat);
    
    // Destroy existing chart if it exists
    if (window.categoryRadarChart) {
        window.categoryRadarChart.destroy();
    }
    
    // Create the radar chart
    const ctx = canvas.getContext('2d');
    window.categoryRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Your Scores',
                data: scores,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    suggestedMin: 0,
                    suggestedMax: 10,
                    ticks: {
                        stepSize: 2,
                        backdropColor: 'rgba(255, 255, 255, 0.8)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const score = context.raw;
                            const categoryName = context.label;
                            return `${categoryName}: ${score.toFixed(1)}/10`;
                        }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            }
        }
    });
}