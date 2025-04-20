/**
 * Enhanced visualizations for the Longevity Calculator
 * Uses Chart.js to create detailed, interactive visualizations of biological age factors
 * and health trajectories
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
    let otherPositiveCount = 0;
    let otherNegativeCount = 0;
    
    factors.forEach(factor => {
        if (Math.abs(factor.impact) >= 1.5) {
            // Significant factor, keep individually
            significantFactors.push(factor);
        } else if (factor.impact > 0) {
            // Small negative factor
            otherNegative += factor.impact;
            otherNegativeCount++;
        } else if (factor.impact < 0) {
            // Small positive factor
            otherPositive += factor.impact;
            otherPositiveCount++;
        }
    });
    
    // Add other categories if they contain factors
    if (otherPositive !== 0) {
        significantFactors.push({
            name: `Other Beneficial Factors (${otherPositiveCount})`,
            impact: otherPositive,
            description: 'Combined impact of smaller beneficial factors'
        });
    }
    
    if (otherNegative !== 0) {
        significantFactors.push({
            name: `Other Risk Factors (${otherNegativeCount})`,
            impact: otherNegative,
            description: 'Combined impact of smaller risk factors'
        });
    }
    
    // Prepare data for the chart
    const labels = significantFactors.map(factor => factor.name);
    const impacts = significantFactors.map(factor => factor.impact);
    
    // Create visually distinct colors for positive and negative values with alpha gradient by impact
    const backgroundColors = impacts.map(impact => {
        const alpha = Math.min(0.9, Math.max(0.5, Math.abs(impact) / 5));
        if (impact < 0) {
            // Beneficial factors (green)
            return `rgba(39, 174, 96, ${alpha})`;
        } else {
            // Risk factors (red)
            return `rgba(231, 76, 60, ${alpha})`;
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
    
    // Create the chart with enhanced styling and interaction
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
                            
                            // Add confidence information if available
                            if (factor && factor.confidence) {
                                label += `\nConfidence: ${Math.round(factor.confidence * 100)}%`;
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
                    },
                    // Add zero line for better visualization
                    afterFit: function(scaleInstance) {
                        // Draw a vertical line at x=0
                        const chart = scaleInstance.chart;
                        const ctx = chart.ctx;
                        const xAxis = chart.scales.x;
                        const yAxis = chart.scales.y;
                        const zeroX = xAxis.getPixelForValue(0);
                        
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(zeroX, yAxis.top);
                        ctx.lineTo(zeroX, yAxis.bottom);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.stroke();
                        ctx.restore();
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
        'medical': 'Medical',
        'mentalHealth': 'Mental Health',
        'socialConnection': 'Social Connection'
    };
    
    const labels = categories.map(cat => categoryLabels[cat] || cat);
    
    // Destroy existing chart if it exists
    if (window.categoryRadarChart) {
        window.categoryRadarChart.destroy();
    }
    
    // Create the radar chart with enhanced styling
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
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
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

/**
 * Creates a line chart showing projected health trajectories
 * @param {Object} trajectoryData - Trajectory data with projections
 * @param {string} canvasId - ID of the canvas element to render the chart in
 */
function createTrajectoryChart(trajectoryData, canvasId) {
    // Check if canvas exists
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
    }
    
    // Extract data for the chart
    const years = trajectoryData.trajectories.noChange.map(point => point.year);
    const chronologicalAges = trajectoryData.trajectories.noChange.map(point => point.chronologicalAge);
    const noChangeAges = trajectoryData.trajectories.noChange.map(point => point.biologicalAge);
    
    // Check if we have intervention data
    const hasInterventions = trajectoryData.trajectories.withInterventions && 
                             trajectoryData.trajectories.withInterventions.length > 0;
    
    // Create datasets
    const datasets = [
        {
            label: 'Chronological Age',
            data: chronologicalAges,
            borderColor: 'rgba(153, 153, 153, 1)',
            backgroundColor: 'rgba(153, 153, 153, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            fill: false
        },
        {
            label: 'Biological Age (No Changes)',
            data: noChangeAges,
            borderColor: 'rgba(231, 76, 60, 1)',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            fill: false
        }
    ];
    
    // Add intervention dataset if available
    if (hasInterventions) {
        const withInterventionAges = trajectoryData.trajectories.withInterventions.map(point => point.biologicalAge);
        
        datasets.push({
            label: 'Biological Age (With Interventions)',
            data: withInterventionAges,
            borderColor: 'rgba(39, 174, 96, 1)',
            backgroundColor: 'rgba(39, 174, 96, 0.1)',
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.1,
            fill: false
        });
    }
    
    // Destroy existing chart if it exists
    if (window.trajectoryChart) {
        window.trajectoryChart.destroy();
    }
    
    // Create the chart
    const ctx = canvas.getContext('2d');
    window.trajectoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Year ${tooltipItems[0].label}: Projection`;
                        }
                    }
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years from Now',
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Age (Years)',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutCubic'
            }
        }
    });
}

/**
 * Creates an interactive body map visualization showing how factors affect different body systems
 * @param {Array} factors - Array of factor objects with impact values
 * @param {string} containerId - ID of the container element
 */
function createBodyMapVisualization(factors, containerId) {
    // Check if container exists
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container element not found:', containerId);
        return;
    }
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create body map SVG container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 300 600');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    
    // Define body systems and their positions
    const bodySystems = [
        {
            id: 'cardiovascular',
            name: 'Cardiovascular',
            path: 'M150,150 C130,130 110,150 110,170 C110,200 130,220 150,240 C170,220 190,200 190,170 C190,150 170,130 150,150 Z',
            factors: ['smoking', 'exercise', 'diet-quality', 'stress', 'salt-intake']
        },
        {
            id: 'brain',
            name: 'Brain & Cognitive',
            path: 'M150,80 C180,80 200,100 200,120 C200,150 180,170 150,170 C120,170 100,150 100,120 C100,100 120,80 150,80 Z',
            factors: ['mental-activity', 'sleep', 'social', 'stress', 'mindfulness']
        },
        {
            id: 'respiratory',
            name: 'Respiratory',
            path: 'M130,180 C130,160 170,160 170,180 C170,210 190,240 190,270 C190,280 110,280 110,270 C110,240 130,210 130,180 Z',
            factors: ['smoking', 'air-quality', 'exercise']
        },
        {
            id: 'digestive',
            name: 'Digestive',
            path: 'M130,280 C130,260 170,260 170,280 C170,330 180,350 180,370 C180,390 120,390 120,370 C120,350 130,330 130,280 Z',
            factors: ['diet-quality', 'processed-food', 'diet-type', 'water-intake']
        },
        {
            id: 'immune',
            name: 'Immune System',
            path: 'M90,220 C70,220 60,200 60,180 C60,160 70,150 85,150 M210,220 C230,220 240,200 240,180 C240,160 230,150 215,150',
            factors: ['sleep', 'stress', 'diet-quality', 'exercise']
        },
        {
            id: 'musculoskeletal',
            name: 'Musculoskeletal',
            path: 'M100,190 L80,250 L70,350 L90,450 M200,190 L220,250 L230,350 L210,450 M130,370 L120,450 L120,530 M170,370 L180,450 L180,530',
            factors: ['exercise', 'strength-training', 'daily-movement']
        }
    ];
    
    // Map factors to body systems
    const systemImpacts = {};
    bodySystems.forEach(system => {
        systemImpacts[system.id] = { positive: 0, negative: 0, total: 0, count: 0 };
    });
    
    // Calculate impact of factors on each body system
    factors.forEach(factor => {
        if (!factor.name) return;
        
        const factorKey = factor.name.toLowerCase().replace(/[\s()]/g, '-');
        
        bodySystems.forEach(system => {
            if (system.factors.some(f => factorKey.includes(f))) {
                if (factor.impact < 0) {
                    systemImpacts[system.id].positive += Math.abs(factor.impact);
                } else {
                    systemImpacts[system.id].negative += factor.impact;
                }
                systemImpacts[system.id].total += factor.impact;
                systemImpacts[system.id].count++;
            }
        });
    });
    
    // Create body systems
    bodySystems.forEach(system => {
        const impact = systemImpacts[system.id];
        
        // Calculate color based on impact
        let color = '#CCCCCC';  // Default gray
        if (impact.count > 0) {
            if (impact.total < 0) {
                // Positive impact (green)
                const intensity = Math.min(1, Math.abs(impact.total) / 5);
                const green = Math.floor(174 + (81 * (1 - intensity)));
                color = `rgb(39, ${green}, 96)`;
            } else if (impact.total > 0) {
                // Negative impact (red)
                const intensity = Math.min(1, impact.total / 5);
                const red = Math.floor(231 - (156 * (1 - intensity)));
                color = `rgb(${red}, 76, 60)`;
            }
        }
        
        // Create system path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', system.path);
        path.setAttribute('fill', impact.count > 0 ? color : 'none');
        path.setAttribute('stroke', '#333333');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('id', system.id);
        path.setAttribute('opacity', '0.8');
        
        // Add hover effects
        path.addEventListener('mouseover', () => {
            path.setAttribute('opacity', '1');
            path.setAttribute('stroke-width', '3');
            updateSystemInfo(system, impact);
        });
        
        path.addEventListener('mouseout', () => {
            path.setAttribute('opacity', '0.8');
            path.setAttribute('stroke-width', '2');
            clearSystemInfo();
        });
        
        svg.appendChild(path);
    });
    
    // Add outline body shape for context
    const bodyOutline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bodyOutline.setAttribute('d', 'M150,60 C190,60 210,90 210,120 C210,140 200,160 200,170 C200,190 220,210 220,250 C220,290 210,340 210,400 C210,430 230,450 230,500 C230,560 180,560 180,530 C180,510 180,480 180,450 C180,430 170,420 150,420 C130,420 120,430 120,450 C120,480 120,510 120,530 C120,560 70,560 70,500 C70,450 90,430 90,400 C90,340 80,290 80,250 C80,210 100,190 100,170 C100,160 90,140 90,120 C90,90 110,60 150,60 Z');
    bodyOutline.setAttribute('fill', 'none');
    bodyOutline.setAttribute('stroke', '#999999');
    bodyOutline.setAttribute('stroke-width', '1');
    bodyOutline.setAttribute('stroke-dasharray', '3,3');
    bodyOutline.setAttribute('opacity', '0.5');
    svg.appendChild(bodyOutline);
    
    // Create info box for hover details
    const infoBox = document.createElement('div');
    infoBox.className = 'body-map-info';
    infoBox.style.display = 'none';
    
    // Function to update system info on hover
    function updateSystemInfo(system, impact) {
        if (impact.count === 0) {
            infoBox.innerHTML = `
                <h4>${system.name} System</h4>
                <p>No lifestyle factors affecting this system were found in your assessment.</p>
            `;
        } else {
            // Find factors affecting this system
            const relevantFactors = factors.filter(factor => {
                if (!factor.name) return false;
                const factorKey = factor.name.toLowerCase().replace(/[\s()]/g, '-');
                return system.factors.some(f => factorKey.includes(f));
            });
            
            // Sort by impact magnitude
            relevantFactors.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
            
            // Create factor list
            const factorsList = relevantFactors.map(factor => {
                const iconClass = factor.impact < 0 ? 'positive' : 'negative';
                return `<li class="${iconClass}">${factor.name}: ${factor.impact < 0 ? 'Reduces' : 'Adds'} biological age by ${Math.abs(factor.impact).toFixed(1)} years</li>`;
            }).join('');
            
            infoBox.innerHTML = `
                <h4>${system.name} System</h4>
                <p>Net impact: ${impact.total.toFixed(1)} years on biological age</p>
                <ul>${factorsList}</ul>
            `;
        }
        
        infoBox.style.display = 'block';
    }
    
    // Function to clear system info
    function clearSystemInfo() {
        infoBox.style.display = 'none';
    }
    
    // Add SVG and info box to container
    container.appendChild(svg);
    container.appendChild(infoBox);
    
    // Add styling for the info box
    const style = document.createElement('style');
    style.textContent = `
        .body-map-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .body-map-info h4 {
            margin-top: 0;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .body-map-info ul {
            padding-left: 20px;
        }
        .body-map-info li {
            margin-bottom: 5px;
        }
        .body-map-info li.positive {
            color: #27ae60;
        }
        .body-map-info li.negative {
            color: #e74c3c;
        }
    `;
    document.head.appendChild(style);
}

// Export functions
// In a browser environment, attach to window
if (typeof window !== 'undefined') {
    window.createFactorsChart = createFactorsChart;
    window.createCategoryRadarChart = createCategoryRadarChart;
    window.createTrajectoryChart = createTrajectoryChart;
    window.createBodyMapVisualization = createBodyMapVisualization;
}

// For module environments, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createFactorsChart,
        createCategoryRadarChart,
        createTrajectoryChart,
        createBodyMapVisualization
    };
}